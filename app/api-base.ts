export abstract class ApiBase {
    private readonly baseUrl = 'http://localhost:6382';

    protected url = (relativePath: string) => this.baseUrl + relativePath;
}