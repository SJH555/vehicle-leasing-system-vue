import request from "@/utils/request.js"

export function upload(file) {
    return request({
        url: "/rent/minio/upload",
        method: "post",
        data: file
    })
}