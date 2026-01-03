export interface IStorageService {
    uploadImage(bucket: string, path: string, buffer: Buffer, mimeType: string): Promise<string>;
}
