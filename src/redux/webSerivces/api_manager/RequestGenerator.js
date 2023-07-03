import RequestCreator from './RequestCreater';

export async function LoginApiWorker(ref, url, param) {
  return await RequestCreator.getRequest(url, param);
}
