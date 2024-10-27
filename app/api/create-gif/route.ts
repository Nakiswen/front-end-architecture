import { NextResponse } from 'next/server';
// import multer from 'multer';
import GIFEncoder from 'gifencoder';
import { createCanvas, loadImage } from 'canvas';

// 配置 multer 使用内存存储
// const upload = multer({ storage: multer.memoryStorage() });

// 定义 API 路由的 POST 请求处理逻辑
export async function POST(req: Request) {

    // 使用 multer 处理上传的文件
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    const encoder = new GIFEncoder(300, 300);
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext('2d');

    // 设置 GIF 编码参数
    encoder.start();
    encoder.setRepeat(0); // 无限循环
    encoder.setDelay(500); // 每帧延迟500毫秒
    encoder.setQuality(10); // GIF 质量

    // 创建一个可写流，用于返回 GIF
    const stream = encoder.createReadStream();
    encoder.finish(); // 结束 GIF 编码

    // 处理上传的每个文件
    for (const file of files) {
        file.arrayBuffer().then(async (buffer: ArrayBuffer) => {
            const img = await loadImage(buffer as Buffer); // 加载图片
            ctx.clearRect(0, 0, 300, 300); // 清空画布
            ctx.drawImage(img, 0, 0, 300, 300); // 绘制图片
            // @ts-expect-error mistake: TS2322
            encoder.addFrame(ctx); // 添加帧
        })
    }

    // 将 GIF 流返回响应
    return NextResponse.json(stream, {
        headers: {
            'Content-Type': 'image/gif',
        },
    });
}
