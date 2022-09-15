# Giới thiệu

Nội dung tài liệu này quy định việc đặt tên nhánh cho phù hợp với quy định của công ty.

## Nội dung

- [Quy ước](#Quy-ước)
- [Tên nhánh](#Tên-nhánh)

### Quy ước

Khi tạo mới một nhánh. `type` của nhánh sẽ bao gồm `feature | bugfix | hotfix | release | support`.

```ssh
  git checkout -b type/branch-name
```

### Tên nhánh

- Nhánh sử dụng để implement tính năng mới bắt đầu bằng prefix `feature/`.
- Nhánh dùng để fix bug bắt đầu bằng prefix `bugfix/`.
- Tên nhánh đi kèm với id task trên Jira và mô tả ngắn gọn mục đích của nhánh.

Ví dụ:

```ssh
 bugfix/OT-001-homepage-search
```

**Lưu ý: Task ID phải viết hoa giống như bên Jira thì mới tự động link qua JIRA được.**
