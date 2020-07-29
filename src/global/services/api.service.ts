import { Singleton } from '../../singleton';
import RemapperService, { toJSON } from './mapper.service';
import { ParsedBodyResponse } from './api/response';

export enum Method {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH'
}

let RequestLogger;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BasicObject = { [k: string]: any };

type HTMLOngoingRequestsNotifier = HTMLElement & { ongoing(requests: Request[], aborted?: Error | Response): any };

/**
 * By default, every request is handled as JSON.
 * If not, simply re-define the `Content-Type` in your request call.
 * If you need to do this a lot, make a wrapper class.
 *
 * This class could deserve a healthy amount of web-worker caching.
 */
export default class ApiService extends Singleton {
  defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  ui: HTMLOngoingRequestsNotifier;

  setWorkerNotifierElement(element: HTMLOngoingRequestsNotifier) {
    if (this.ui) {
      throw new Error('setWorkerNotifierElement: No more than one notifier allowed!');
    }

    RequestLogger.info('Displaying fetch status on ', element);

    this.ui = element;
  }

  static getInstance() {
    if (!ApiService.instance) {
      RequestLogger = LoggerService.extendNS('api');
    }

    return super.getInstance();
  }

  // eslint-disable-next-line class-methods-use-this
  get urlBase() {
    // TODO: Split ApiService into another base-class named HTTPService
    // Use apiRootPath only in this super class type
    return ApplicationService.baseUrl + ApplicationService.basePath + ApplicationService.apiRootPath;
  }

  async _request<B>(
    method: Method,
    url: string | URL,
    headersInit: HeadersInit = this.defaultHeaders,
    body: BodyInit | BasicObject = null,
  ): Promise<ParsedBodyResponse<B>> {
    let _url = url;
    const headers = new Headers(headersInit);

    if (typeof url === 'string') {
      _url = new URL(url, this.urlBase);
    }

    let preparedBody = body;

    // if (body is pure-object)
    // On the right comparitor, we make sure that the body is NOT an instance of:
    // Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array>
    if (body && typeof body === 'object' && body.constructor === Object) {
      headers.set('Content-Type', 'application/json');
      preparedBody = toJSON(body);
    }

    const request = new Request(_url.toString(), {
      method,
      headers,
      body: preparedBody as BodyInit,
    });

    RequestLogger.log('📮 ', String(url));

    this.requestFire(request);
    return fetch(request).then(async (response) => {
      if (!response.ok) { throw response; }
      RequestLogger.log('✔ ', String(response.url));
      this.requestFinished(request);
      return this.remapResponseBody<B>(response);
    }).catch((error) => {
      RequestLogger.error('🛑', error);
      this.requestFinished(request, error);
      throw error;
    });
  }

  activeRequests: Request[] = [];

  private requestFinished(finishedRequest: Request, aborted?: Error | Response) {
    this.activeRequests = this.activeRequests.filter((request) => request !== finishedRequest);
    this.announceActiveWork(aborted);
  }

  private requestFire(request: Request) {
    this.activeRequests.push(request);
    this.announceActiveWork();
  }

  private announceActiveWork(aborted?: Error | Response) {
    if (this.ui) {
      this.ui.ongoing([...this.activeRequests], aborted);
    }
  }

  async resolveBlobURL<M>(blobUrl: string, model?: { new(): M }) {
    if (new URL(blobUrl).protocol === 'blob:') {
      const response = await this.get(blobUrl);

      if (model) {
        return response.reModel(model);
      }

      return response.parsedBody;
    }
    throw new Error('URL is not a blob ressource.');
  }

  // eslint-disable-next-line class-methods-use-this
  private async remapResponseBody<B>(originalResponse: Response) {
    const cleanResponse = originalResponse.clone();
    const { headers } = originalResponse;

    let newBody: any = false;

    if (headers.has('Content-Type')) {
      switch (headers.get('Content-Type')) {
        case 'application/json':
          newBody = await originalResponse.json();
          break;
        default:
          newBody = await originalResponse.text();
      }
    }

    return new ParsedBodyResponse<B>(newBody, cleanResponse);
  }

  async get<B = any>(url: string | URL, headers?: HeadersInit) {
    return this._request<B>(Method.GET, url, headers);
  }

  async post<B = any>(url: string | URL, body?: BasicObject | BodyInit, headers?: HeadersInit) {
    return this._request<B>(Method.POST, url, headers, body);
  }

  async delete<B = any>(url: string | URL, body?: BasicObject | BodyInit, headers?: HeadersInit) {
    return this._request<B>(Method.DELETE, url, headers, body);
  }

  async put<B = any>(url: string | URL, body?: BasicObject | BodyInit, headers?: HeadersInit) {
    return this._request<B>(Method.PUT, url, headers, body);
  }

  async patch<B = any>(url: string | URL, body?: BasicObject | BodyInit, headers?: HeadersInit) {
    return this._request<B>(Method.PATCH, url, headers, body);
  }

  async head<B = any>(url: string | URL, headers?: HeadersInit) {
    return this._request<B>(Method.HEAD, url, headers);
  }

  async connect<B = any>(url: string | URL, headers?: HeadersInit) {
    return this._request<B>(Method.CONNECT, url, headers);
  }

  async options<B = any>(url: string | URL, headers?: HeadersInit) {
    return this._request<B>(Method.OPTIONS, url, headers);
  }

  async trace<B = any>(url: string | URL, headers?: HeadersInit) {
    return this._request<B>(Method.TRACE, url, headers);
  }
}
