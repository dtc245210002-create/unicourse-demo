# UniCourse demo

Mở index.html bằng Chrome hoặc Edge, không cần cài đặt. Giữ thư mục ../shared bên cạnh thư mục demo.

Có tìm kiếm, lọc, tiên quyết, giỏ học phần, kiểm tra trùng lịch, lớp thay thế, gợi ý, xác nhận demo, lịch sử theo tài khoản và tải lịch ICS. Số tiết 1–12 đã cố định ở cột trái; đã kiểm tra lịch trống, lịch trùng và lịch đã xử lý trên desktop/mobile.

Dữ liệu môn, lịch và hồ sơ là giả lập. Tài khoản và biên nhận lưu trong trình duyệt, không phải xác thực hay đăng ký tại trường. Gợi ý dùng ràng buộc và điểm ưu tiên, chưa được đánh giá bằng nghiên cứu sinh viên.

Các module: app.js, styles.css, engine.js, storage.js, calendar.js và ../shared/catalog.js. Thư mục hiện chỉ giữ tệp sản phẩm; công cụ kiểm thử và ảnh trung gian đã được dọn theo yêu cầu.

Cập nhật ngày 12/10/2026:
- Điều kiện tiên quyết hiển thị mã và tên môn, gồm cả môn nền tảng không nằm trong danh mục mở kỳ này.
- Mục xổ xuống “Ngày không muốn học” nằm dưới số tín chỉ, chọn nhiều ngày từ Thứ 2 tới Chủ nhật. Mặc định không giới hạn; thuật toán loại các lớp rơi vào ngày đã chọn.
- Sau xác nhận hoặc xem lại một lần đăng ký, tải Excel .xlsx và lịch .ics; “In / Lưu PDF” mở bản in A4 ngang. Trong hộp thoại in, chọn Save as PDF/Lưu dưới dạng PDF.
- Tệp xuất lấy các lớp trong lần xác nhận đang xem, không lấy giỏ đang chỉnh sửa. Nội dung có tên môn, mã lớp, tín chỉ, ngày/giờ, phòng, giảng viên và ghi chú dữ liệu demo.

Google Calendar được rút gọn thành một nút **Thêm vào Google Calendar** bên cạnh lịch đã xác nhận. Bấm nút sẽ yêu cầu tải tệp ICS của lần xác nhận đang xem và mở Google Calendar trong tab mới. Trên Google, chọn Cài đặt → Nhập và xuất → nhập tệp vừa tải. Đây là nhập lịch một lần, không tự đồng bộ hoặc báo đã thêm thành công. Các nút Excel, In/Lưu PDF và ICS riêng giữ nguyên. Nếu trình duyệt chặn tải xuống hoặc tab mới, dùng nút tải ICS riêng và mở Google Calendar thủ công.
