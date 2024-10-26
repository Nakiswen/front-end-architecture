// app/api/create-gif/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gifencoder';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: '没有上传图片' },
                { status: 400 }
            );
        }

        // 确保临时目录存在
        const tempDir = path.join(process.cwd(), 'tmp');
        if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true });
        }

        // 保存上传的文件并获取文件路径
        const filePaths = await Promise.all(
            files.map(async (file: any, index) => {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filePath = path.join(tempDir, `image-${index}.png`);
                await writeFile(filePath, buffer);
                return filePath;
            })
        );

        try {
            // 创建 GIF
            const encoder = new GIFEncoder(400, 400);
            const canvas = createCanvas(400, 400);
            const ctx = canvas.getContext('2d');

            // 初始化 GIF 编码器
            encoder.start();
            encoder.setRepeat(0);   // 0 表示循环
            encoder.setDelay(500);  // 500ms 延迟
            encoder.setQuality(10); // 质量设置

            // 处理每张图片
            for (const filePath of filePaths) {
                const image = await loadImage(filePath);

                // 清除画布
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 400, 400);

                // 计算居中位置
                const scale = Math.min(
                    400 / image.width,
                    400 / image.height
                );
                const x = (400 - image.width * scale) / 2;
                const y = (400 - image.height * scale) / 2;

                // 绘制图片
                ctx.drawImage(
                    image,
                    x,
                    y,
                    image.width * scale,
                    image.height * scale
                );

                encoder.addFrame(ctx);
            }

            // 完成 GIF 生成
            encoder.finish();

            // 获取生成的 GIF 数据
            const gifBuffer = encoder.out.getData();

            // 返回 GIF
            return new NextResponse(gifBuffer, {
                headers: {
                    'Content-Type': 'image/gif',
                    'Content-Length': gifBuffer.length.toString(),
                },
            });
        } finally {
            // 清理临时文件
            await Promise.all(filePaths.map(async (filePath) => {
                try {
                    const fs = await import('fs').then(mod => mod.promises);
                    await fs.unlink(filePath);
                } catch (error) {
                    console.error('Error deleting temp file:', error);
                }
            }));
        }

    } catch (error) {
        console.error('Error creating GIF:', error);
        return NextResponse.json(
            { error: '生成GIF时出错' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { error: '不支持的请求方法' },
        { status: 405 }
    );
}