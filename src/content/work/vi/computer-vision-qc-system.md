---
locale: vi
title: "Hệ thống Machine Vision QC Dược phẩm"
summary: "Hệ thống AI machine vision QC cho dược phẩm, kết hợp camera công nghiệp, máy tính công nghiệp, model training và quy trình kiểm định khắt khe."
description: "Lưu ý bảo mật: Chúng tôi không thể cung cấp mọi thông tin hay mã nguồn, vì đây là dự án mang tính riêng tư và bảo mật của doanh nghiệp. Dự án tập trung vào AI machine vision cho kiểm tra chất lượng dược phẩm, từ thu thập dữ liệu, thiết kế case lỗi, train model, kiểm thử độ chính xác, tối ưu inference đến triển khai với camera công nghiệp, máy tính công nghiệp và các thiết bị nhúng trong dây chuyền."
overview: "Dự án được xây dựng như một pipeline QC công nghiệp hoàn chỉnh: camera công nghiệp thu ảnh sản phẩm, hệ thống tiền xử lý chuẩn hóa vùng quan tâm, model AI phát hiện lỗi/biến dạng/bất thường, lớp rule kiểm định kết quả, sau đó dashboard hiển thị trạng thái để phục vụ vận hành sản xuất."
problem: "QC dược phẩm yêu cầu độ ổn định cao, sai số thấp và quy trình làm việc rất khắt khe. Kiểm tra thủ công dễ mệt mỏi, không đồng nhất và khó scale theo tốc độ dây chuyền. Hệ thống cần xử lý nhiều case lỗi, ánh sáng thay đổi, vị trí sản phẩm không tuyệt đối cố định, yêu cầu trace kết quả và khả năng chạy ổn định trên phần cứng công nghiệp."
approach: "Quy trình kỹ thuật bao gồm thu thập ảnh từ camera công nghiệp, tạo tập dữ liệu theo từng defect case, gán nhãn, cân bằng dữ liệu, train/validate model, kiểm thử theo threshold chất lượng, tối ưu preprocessing, crop ROI, normalize ánh sáng, kiểm soát false positive/false negative và đóng gói inference để chạy trên máy tính công nghiệp/edge device. Hệ thống cũng được thiết kế để làm việc với trigger camera, cấu hình dây chuyền, logging, báo cáo kết quả và kiểm thử lặp lại trong môi trường sản xuất."
role: "Project Manager"
period: "2024"
featured: true
order: 3
heroImage: "/work/computer-vision-qc/main.jpg"
highlights:
  - title: "Industrial QC inspection"
    description: "Machine-vision inspection flow for pharmaceutical blister quality control."
    src: "/work/computer-vision-qc/inspection-video.mp4"
  - title: "Inspection sample 1"
    description: "Captured production sample used for defect analysis and validation."
    src: "/work/computer-vision-qc/inspection-1.jpg"
  - title: "Inspection sample 2"
    description: "Camera/frame sample for visual inspection and model testing."
    src: "/work/computer-vision-qc/inspection-2.jpg"
  - title: "Inspection sample 3"
    description: "Industrial image sample used during data review and edge validation."
    src: "/work/computer-vision-qc/inspection-3.jpg"
video:
  src: "/work/computer-vision-qc/demo.mp4"
  label: "Machine Vision QC demo"
  description: "Demo of the industrial computer-vision inspection workflow."
gallery:
  - label: "QC main screen"
    src: "/work/computer-vision-qc/main.jpg"
  - label: "QC demo video"
    src: "/work/computer-vision-qc/demo.mp4"
  - label: "QC inspection video"
    src: "/work/computer-vision-qc/inspection-video.mp4"
  - label: "Inspection sample 1"
    src: "/work/computer-vision-qc/inspection-1.jpg"
  - label: "Inspection sample 2"
    src: "/work/computer-vision-qc/inspection-2.jpg"
  - label: "Inspection sample 3"
    src: "/work/computer-vision-qc/inspection-3.jpg"
  - label: "Inspection sample 4"
    src: "/work/computer-vision-qc/inspection-4.jpg"
storyBlocks:
  - title: "Bảo mật dự án"
    body: "Do tính chất riêng tư của doanh nghiệp, phần mã nguồn, dữ liệu sản xuất, thông số model, threshold kiểm định và một số chi tiết triển khai không thể công khai đầy đủ."
  - title: "AI vision workflow"
    body: "Phần quan trọng nhất của dự án là biến dữ liệu sản xuất thành một workflow AI có thể kiểm chứng: thu thập ảnh, phân loại defect case, gán nhãn, train model, validate trên case thật và kiểm soát sai số trước khi đưa vào vận hành."
  - title: "Industrial deployment"
    body: "Hệ thống không chỉ là model demo. Nó phải tương thích với camera công nghiệp, máy tính công nghiệp, điều kiện ánh sáng, tốc độ dây chuyền, trigger chụp ảnh, logging kết quả và yêu cầu vận hành liên tục."
showBody: false
metrics:
  - value: "$11K"
    label: "giá trị kinh doanh xấp xỉ tạo ra"
  - value: "Industrial AI"
    label: "camera công nghiệp và edge inference"
  - value: "Strict QC"
    label: "dataset, defect cases và accuracy gates"
outcomes:
  - "Tạo ra giá trị kinh doanh ước tính khoảng $11,000 USD."
  - "Xây dựng pipeline AI machine vision phục vụ QC dược phẩm với dữ liệu lỗi, huấn luyện model, kiểm thử độ chính xác và tối ưu inference."
  - "Làm việc với camera công nghiệp, máy tính công nghiệp, phần cứng nhúng/edge device và workflow kiểm định nghiêm ngặt trong môi trường sản xuất."
  - "Giảm phụ thuộc vào kiểm tra thủ công và tạo nền tảng để chuẩn hóa quy trình phát hiện lỗi trên dây chuyền."
links:
  - label: "GitHub"
    href: "#"
    note: "Chúng tôi không thể cung cấp mọi thông tin hay mã nguồn, vì đây là dự án mang tính riêng tư và bảo mật của doanh nghiệp."
---

## Context

Hệ thống Machine Vision QC Dược phẩm được xây dựng để hỗ trợ công tác kiểm tra chất lượng trong sản xuất dược phẩm. Hệ thống sử dụng thị giác máy tính và học sâu để phát hiện các lỗi trực quan, biến dạng và các điều kiện bất thường của sản phẩm trên vỉ thuốc.
