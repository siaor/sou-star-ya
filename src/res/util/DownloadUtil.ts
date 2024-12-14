/**
 * 下载工具类
 *
 * @description
 * @author Siaor
 * @date 2024-12-14 05:07:00
 * */
export class DownloadUtil {

    static exportFile(fileName: string, content: string): any {
        //创建一个Blob对象，包含要下载的JSON数据
        const blob = new Blob([content], {type: 'application/json'});

        //创建一个指向Blob对象的URL
        const downloadUrl = URL.createObjectURL(blob);

        //创建一个<a>元素，设置其href属性为创建的URL，并设置下载的文件名
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;

        //触发<a>元素的点击事件以下载文件
        document.body.appendChild(a);
        a.click();

        //移除<a>元素并从内存中释放URL对象
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    }
}