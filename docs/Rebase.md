# Giới thiệu

Nội dung phần tài liệu này mô tả về quy trình rebase cũng như lý do tại sau lại sử dụng rebase trong dự án.

## Nội dung

- [Rebase để làm gì?](#Rebase-để-làm-gì?)
- [Tại sao lại là rebase?](#Tại-sao-lại-là-rebase?)
- [Khi nào thì cần rebase?](#Khi-nào-thì-cần-rebase?)
- [Quy trình rebase](#Quy-trình-rebase)

### Rebase để làm gì?

- Dùng để thay thế cho merge, nhưng tiếp cận theo một hướng khác.
- Xử lý conflict.
- Lấy code mới từ nhánh chính về.

### Tại sao lại là rebase?

- Khi merge sẽ giải quyết tất cả conflict trong một commit, sẽ gây khó khăn trong việc giải quyết conflict.
- Rebase sẽ giải quyết conflict ở ngay chính commit gây ra conflict, sẽ giúp dễ dàng xử lý conflict.
- Khi rebase để xủ lý conflict, trường hợp xấu nhất mình vẫn có thể checkout và code lại commit đó từ đầu theo nội dung của commit message.
- Merge sẽ lấy code của nhánh phụ làm code chính, nên dễ gây đè code, còn rebase sẽ lấy code của nhánh chính làm chính.
- Khi rebase thì nhánh git sẽ gọn và trực quan hơn.
- Rebase còn giúp ích cho các công việc quản lý khác.

### Khi nào thì cần rebase?

- Rebase khi muốn lấy code từ nhánh develop về nhánh mình.
- Khi gặp conflict phải resolve bằng rebase.
- Nên rebase thường xuyên (khi có commit mới ở develop) và rebase trước khi tạo pull request, tránh trường hợp gặp khó khăn khi rebase quá nhiều commit.

### Quy trình rebase

1. Lấy code mới nhất từ remote về và tiến hành rebase lên nhánh chính.

```ssh
 git fetch
 git rebase origin/develop
```

2. Xử lý conflict nếu có.

```
 // TODO: Cách xử lý conflict

 Trong trường hợp xấu nhất thì checkout lại file bị conflict và code lại theo commit cũ tương ứng.

 // Rebase trên branch chỉ có một người code đồng thời thì sẽ đơn giản, nhưng nếu hai người code cùng lúc thì sẽ thêm nhiều case phải handle hơn, nhưng theo git-flow thì mình đã hạn chế trường hợp một branch nhiều người code cùng một thời điểm rồi.
```

3. Cần phải check kỹ code hiện tại sau khi rebase, phải đảm bảo tương đương code cũ, không bị lỗi, ...

4. Chạy lệnh sau để chính thức đè code của mình lên remote.

```ssh
git push --force-with-lease
```
