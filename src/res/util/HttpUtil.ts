import {ActResult} from "@/dom/def/base/ActResult";
import {ActCode} from "@/dom/def/base/ActCode";

/**
 * // 调用示例
 * // 假设有一个API URL
 * const apiUrl = 'https://api.example.com/data';
 *
 * // GET 请求
 * HttpUtils.get(apiUrl)
 *     .then(data => console.log(data))
 *     .catch(error => console.error(error));
 *
 * // POST 请求
 * HttpUtils.post(apiUrl, { key: 'value' })
 *     .then(data => console.log(data))
 *     .catch(error => console.error(error));
 *
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class HttpUtil {

    static get(url: string, headers?: HeadersInit): Promise<ActResult> {
        return new Promise((resolve) => {
            fetch(url, {
                method: 'GET',
                headers: headers || {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(url)
                        resolve(ActResult.fail(ActCode.FAILURE, response.statusText));
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    resolve(ActResult.ok(data));
                })
                .catch(error => {
                    console.log(url)
                    resolve(ActResult.fail(ActCode.FAILURE, error));
                });
        });
    }

    static getText(url: string, headers?: HeadersInit): Promise<ActResult> {
        return new Promise((resolve) => {
            fetch(url, {
                method: 'GET',
                headers: headers || {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(url)
                        resolve(ActResult.fail(ActCode.FAILURE, response.statusText));
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    resolve(ActResult.ok(data));
                })
                .catch(error => {
                    console.log(url)
                    resolve(ActResult.fail(ActCode.FAILURE, error));
                });
        });
    }

    static async post(url: string, body: any, headers?: HeadersInit): Promise<ActResult> {
        return new Promise((resolve) => {
            fetch(url, {
                method: 'POST',
                headers: headers || {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(url)
                        resolve(ActResult.fail(ActCode.FAILURE, response.statusText));
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    resolve(ActResult.ok(data));
                })
                .catch(error => {
                    console.log(url)
                    resolve(ActResult.fail(ActCode.FAILURE, error));
                });
        });
    }
}