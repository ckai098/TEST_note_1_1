const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 创建邮件传输器（使用QQ邮箱）
const transporter = nodemailer.createTransport({
    service: 'QQ',  // 使用QQ邮箱服务
    host: 'smtp.qq.com',
    port: 465,
    secure: true,   // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,     // 您的QQ邮箱
        pass: process.env.EMAIL_PASS      // 您的QQ邮箱授权码
    }
});

// 处理发送邮件的路由
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // 邮件选项
        const mailOptions = {
            from: `"个人网站消息" <${process.env.EMAIL_USER}>`,  // 发件人
            to: process.env.EMAIL_TO,       // 收件人（您的接收邮箱）
            subject: `来自个人网站的新消息 - ${name}`,
            html: `
                <h3>新的联系表单消息</h3>
                <p><strong>姓名：</strong> ${name}</p>
                <p><strong>邮箱：</strong> ${email}</p>
                <p><strong>消息：</strong></p>
                <p>${message}</p>
            `
        };

        // 发送邮件
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: '邮件发送成功！' });
    } catch (error) {
        console.error('发送邮件时出错：', error);
        res.status(500).json({ message: '发送邮件失败，请稍后重试。' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 