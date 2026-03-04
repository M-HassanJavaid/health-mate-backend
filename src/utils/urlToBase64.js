import { fileTypeFromBuffer } from "file-type";

async function urlToBase64(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileTypeResult = await fileTypeFromBuffer(buffer);
    const mime = fileTypeResult?.mime || res.headers.get("content-type") || "application/octet-stream";

    return `data:${mime};base64,${buffer.toString("base64")}`;
}

export default urlToBase64