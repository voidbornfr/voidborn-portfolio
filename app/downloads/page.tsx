import fs from 'fs';
import path from 'path';
import DownloadsView from '@/components/downloads/DownloadsView';

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function DownloadsPage() {
    const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
    let files: { name: string; size: string; path: string }[] = [];

    try {
        if (fs.existsSync(downloadsDir)) {
            const fileNames = fs.readdirSync(downloadsDir);
            files = fileNames.map(name => {
                const stats = fs.statSync(path.join(downloadsDir, name));
                return {
                    name,
                    size: formatBytes(stats.size),
                    path: `/downloads/${name}`
                }
            });
        }
    } catch (error) {
        console.error("Error reading downloads directory:", error);
    }

    return <DownloadsView files={files} />;
}
