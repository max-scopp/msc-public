/* eslint-disable max-classes-per-file */
import { createObjectURL } from '../../../core/utils/url';
import { fromObject } from '../mapper.service';
import { Model } from './model';

class NativeResponse implements Response {
  _n: Response;

  constructor(body, init) {
    this._n = new Response(body, init);
  }

  get headers() { return this._n.headers; }

  get ok() { return this._n.ok; }

  get redirected() { return this._n.redirected; }

  get status() { return this._n.status; }

  get statusText() { return this._n.statusText; }

  get trailer() { return this._n.trailer; }

  get type() { return this._n.type; }

  get url() { return this._n.url; }

  clone(): Response {
    return this._n.clone();
  }

  get body() { return this._n.body; }

  get bodyUsed() { return this._n.bodyUsed; }

  arrayBuffer(): Promise<ArrayBuffer> {
    return this._n.arrayBuffer();
  }

  blob(): Promise<Blob> {
    return this._n.blob();
  }

  formData(): Promise<FormData> {
    return this._n.formData();
  }

  json(): Promise<any> {
    return this._n.json();
  }

  text(): Promise<string> {
    return this._n.text();
  }
}

export class ParsedBodyResponse<T> extends NativeResponse {
  constructor(readonly parsedBody: T, initialResponse: Response) {
    super(initialResponse.body, initialResponse);
  }

  async blobify<M extends Model = Model>(model?: { new(): M }) {
    const blob = await this.clone().blob();
    const url = createObjectURL(blob);

    return {
      url,
      resolve: async () => ApiService.resolveBlobURL(url, model),
    };
  }

  reModel<M>(model: { new(): M }): M {
    return fromObject<M>(model, this.parsedBody);
  }
}
