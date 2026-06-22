# TableBooking - Business Logic

## 1. Giới thiệu

TableBooking là hệ thống hỗ trợ khách hàng tìm kiếm nhà hàng, xem thông tin nhà hàng và đặt bàn trực tuyến.

Hệ thống gồm 4 nhóm người dùng:

- Guest (khách chưa đăng nhập)
- Customer (khách hàng)
- Restaurant Owner (chủ nhà hàng)
- Admin (quản trị viên)

---

# 2. Luồng tổng thể hệ thống

```text
Khách hàng
    ↓
Tìm kiếm nhà hàng
    ↓
Xem thông tin nhà hàng
    ↓
Chọn ngày giờ đặt bàn
    ↓
Hệ thống kiểm tra bàn trống
    ↓
Tạo booking
    ↓
Chủ nhà hàng xác nhận
    ↓
Khách đến sử dụng dịch vụ
    ↓
Hoàn thành booking
    ↓
Đánh giá nhà hàng
```

---

# 3. Chức năng Guest

Guest là người chưa đăng nhập.

## 3.1 Đăng ký

Người dùng nhập:

- Họ tên
- Email
- Mật khẩu
- Số điện thoại

Hệ thống:

- Kiểm tra email đã tồn tại chưa
- Mã hóa mật khẩu
- Tạo tài khoản mới

Trạng thái:

```text
ACTIVE
```

---

## 3.2 Đăng nhập

Người dùng đăng nhập bằng:

- Email
- Password

Hệ thống:

- Kiểm tra tài khoản
- Kiểm tra mật khẩu
- Sinh Access Token
- Trả về thông tin người dùng

---

## 3.3 Xem danh sách nhà hàng

Guest có thể:

- Xem danh sách nhà hàng
- Xem thông tin chi tiết
- Xem địa chỉ
- Xem giờ hoạt động
- Xem đánh giá

Guest không được đặt bàn.

---

# 4. Chức năng Customer

## 4.1 Cập nhật hồ sơ

Khách hàng có thể:

- Đổi avatar
- Đổi tên
- Đổi số điện thoại
- Đổi mật khẩu

---

## 4.2 Tìm kiếm nhà hàng

Tìm theo:

- Tên
- Địa chỉ
- Loại hình
- Số lượng người

---

## 4.3 Xem chi tiết nhà hàng

Thông tin hiển thị:

- Tên nhà hàng
- Hình ảnh
- Địa chỉ
- Giờ mở cửa
- Giờ đóng cửa
- Sức chứa
- Đánh giá trung bình
- Số lượng đánh giá

---

## 4.4 Đặt bàn

Khách hàng chọn:

- Nhà hàng
- Ngày
- Giờ
- Số lượng khách
- Ghi chú

Hệ thống:

### Bước 1

Kiểm tra:

```text
Ngày đặt hợp lệ
```

Không cho phép:

- Ngày trong quá khứ
- Giờ ngoài thời gian hoạt động

### Bước 2

Kiểm tra số lượng khách.

Ví dụ:

```text
Khách: 6 người
```

Hệ thống tìm:

```text
Bàn 6 người
hoặc
Ghép nhiều bàn
```

### Bước 3

Kiểm tra bàn còn trống.

Không cho phép:

```text
Trùng thời gian đặt
```

### Bước 4

Tạo Booking.

Trạng thái:

```text
PENDING
```

---

## 4.5 Hủy đặt bàn

Khách hàng được phép hủy khi:

```text
Booking chưa COMPLETED
```

Sau khi hủy:

```text
CANCELLED
```

---

## 4.6 Xem lịch sử đặt bàn

Hiển thị:

- Mã đặt bàn
- Nhà hàng
- Ngày giờ
- Số lượng khách
- Trạng thái

---

## 4.7 Đánh giá nhà hàng

Điều kiện:

```text
Booking phải COMPLETED
```

Khách hàng có thể:

- Chấm điểm 1 → 5 sao
- Viết nhận xét

Mỗi booking chỉ được đánh giá một lần.

---

# 5. Chức năng Restaurant Owner

## 5.1 Tạo nhà hàng

Chủ nhà hàng nhập:

- Tên nhà hàng
- Địa chỉ
- Số điện thoại
- Email
- Mô tả
- Hình ảnh

Hệ thống:

```text
PENDING
```

Chờ Admin duyệt.

---

## 5.2 Quản lý thông tin nhà hàng

Cho phép:

- Sửa thông tin
- Cập nhật hình ảnh
- Cập nhật giờ hoạt động

---

## 5.3 Quản lý khu vực

Ví dụ:

```text
Tầng 1
Tầng 2
VIP
Ngoài trời
```

Chủ nhà hàng:

- Tạo khu vực
- Cập nhật khu vực
- Xóa khu vực

---

## 5.4 Quản lý bàn

Chủ nhà hàng:

- Thêm bàn
- Cập nhật bàn
- Xóa bàn

Ví dụ:

```text
A01 - 2 người
A02 - 4 người
A03 - 6 người
```

Trạng thái:

```text
AVAILABLE
MAINTENANCE
```

---

## 5.5 Quản lý booking

Xem:

- Danh sách booking
- Thông tin khách hàng
- Số lượng khách
- Ghi chú

---

## 5.6 Xác nhận booking

Booking mới:

```text
PENDING
```

Owner xác nhận:

```text
CONFIRMED
```

---

## 5.7 Từ chối booking

Nếu không còn bàn:

```text
REJECTED
```

---

## 5.8 Check-in khách

Khi khách đến:

```text
CHECKED_IN
```

---

## 5.9 Hoàn thành booking

Sau khi khách sử dụng dịch vụ:

```text
COMPLETED
```

---

# 6. Chức năng Admin

## 6.1 Quản lý người dùng

Admin có thể:

- Xem danh sách người dùng
- Khóa tài khoản
- Mở khóa tài khoản

Trạng thái:

```text
ACTIVE
INACTIVE
BANNED
```

---

## 6.2 Quản lý nhà hàng

Admin:

- Duyệt nhà hàng
- Từ chối nhà hàng
- Khóa nhà hàng

Trạng thái:

```text
PENDING
ACTIVE
REJECTED
INACTIVE
```

---

## 6.3 Quản lý đánh giá

Admin có thể:

- Xem đánh giá
- Ẩn đánh giá vi phạm

---

## 6.4 Dashboard

Thống kê:

- Tổng người dùng
- Tổng nhà hàng
- Tổng booking
- Tổng đánh giá

---

# 7. Booking Status

```text
PENDING
    ↓

CONFIRMED
    ↓

CHECKED_IN
    ↓

COMPLETED
```

Các trạng thái phụ:

```text
CANCELLED
REJECTED
NO_SHOW
```

---

# 8. Quy tắc nghiệp vụ

## Rule 1

Không cho phép đặt thời gian trong quá khứ.

---

## Rule 2

Không cho phép vượt quá sức chứa bàn.

---

## Rule 3

Không cho phép một bàn được đặt trùng thời gian.

---

## Rule 4

Chỉ khách đã hoàn thành booking mới được đánh giá.

---

## Rule 5

Mỗi booking chỉ được đánh giá một lần.

---

## Rule 6

Nhà hàng phải được Admin duyệt mới được hiển thị công khai.

---

## Rule 7

Booking bị hủy sẽ giải phóng bàn ngay lập tức.

---

# 9. Phiên bản tương lai

Các chức năng mở rộng:

- Đặt món trước
- Thanh toán online
- Mã giảm giá
- Tích điểm thành viên
- Chat với nhà hàng
- Thông báo realtime
- Google Maps
- QR Check-in
- AI gợi ý nhà hàng

```

```
