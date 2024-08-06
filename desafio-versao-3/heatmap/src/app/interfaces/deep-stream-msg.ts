export interface DeepstreamMsg {
  hits: { hits: [{ fields: { 'deepstream-msg': string[] } }] };
}
