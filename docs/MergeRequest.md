# Giới thiệu

Nội dung phần tài liệu này mô tả về quy ước tạo ra một Merge Request.

## Nội dung

- [Tiêu đề](#Tiêu-đề)
- [Mô tả](#Mô-tả)
- [Assignee](#Assignee)
- [Reviewer](#Reviewer)
- [Work flow](#Work-flow)

### Tiêu đề

Tiêu đề là một mô tả ngắn gọn về việc một MR đã và đang làm gì trong một dự án.

Định dạng

```ssh
<[Task Code]> <Branch Type>: <Feature Name>
```

Ví dụ một nhánh có tên là:

```ssh
feature/NOVAID-777-a-button
```

Thì tiêu đề của MR liên quan đến nhánh này là:

```ssh
[NOVAID-777] Feature: Button Component
```

Hoặc nếu tính năng làm màn hình, tích hợp API:

```ssh
[NOVAID-777] Feature: Home Page
[NOVAID-777] Feature: Home Screen
[NOVAID-777] Feature: Home API
```

### Mô tả

Mô tả đầy đủ các thay đổi của một MR. Nó sẽ chứa hết tất cả các mô tả của các commit msg trong một MR. Được biểu diễn dưới dạng danh sách.

Ví dụ về mô tả của một MR:

```ssh
- Create a new Button component.
- Add new icon to assets folder.
```

### Assignee

Có 2 lựa chọn, hoặc là đặt tên người phụ trách review code trước khi merge, hoặc là chính người làm branch này. Thông thường nên chọn là người làm branch này.

### Reviewer

Thông thường là người review ở thời điểm hiện tại mà MR đang đứng. Lần lượt là sublead và teamlead.

### Work flow

Một MR phải đáp ứng các tiêu chí sau thì mới được merge vào source:

- Giải quyết hết tất cả `conflicts`.
- Giải quyết hết tất cả `comments`. Người làm sẽ phải tích vào `Resolve thread` sau khi giải quyết hết các `comments`.
- Phải vượt qua được lớp review của sublead.
- Được `approve` bởi teamlead.

Luồng hoạt động là luồng thực thi của một MR từ khi nó được tạo cho đến khi nó được merge.

Theo thứ tự:

1. Người làm tạo MR và chỉ định người review là sublead.
2. Sublead sẽ tiến hành review. Nếu vượt qua hết các bài kiểm tra, thì sublead sẽ tiến hành chỉ định người review tiếp theo là teamlead.
3. Teamlead tiến hành kiểm tra bước cuối cùng trước khi merge vào source.
