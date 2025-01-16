const nodemailer = require('nodemailer');

// 创建邮件传输器
const transporter = nodemailer.createTransport({
    service: 'QQ',
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只处理POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '方法不允许' });
    }

    const { name, email, message } = req.body;

    try {
        const mailOptions = {
            from: `"个人网站消息" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: `来自个人网站的新消息 - ${name}`,
            html: `
                <h3>新的联系表单消息</h3>
                <p><strong>姓名：</strong> ${name}</p>
                <p><strong>邮箱：</strong> ${email}</p>
                <p><strong>消息：</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: '邮件发送成功！' });
    } catch (error) {
        console.error('发送邮件时出错：', error);
        res.status(500).json({ message: '发送邮件失败，请稍后重试。' });
    }
} 