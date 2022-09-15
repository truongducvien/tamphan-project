# Giới thiệu

Nội dung tài liệu này quy định việc viết `commit message` sao cho đúng quy tắc được đặt ra.

Các quy ước được xác minh bởi [commitlint](https://commitlint.js.org/#/).

## Nội dung

- [Lý do cho những quy ước này](#Lý-do-cho-những-quy-ước-này)
- [Định dạng](#Định-dạng)
  - [Emoji](#Emoji)
  - [Type](#Type)
  - [Scope](#Scope)
  - [Description](#Description)
  - [Breaking changes](#Breaking-changes)
  - [Issue references](#Issue-references)
- [Sử dụng](#Sử-dụng)

### Lý do cho những quy ước này

- Tự động tạo bảng thay đổi.
- Điều hướng đơn giản thông qua lịch sử git.

### Định dạng

Có nhiều định dạng quyết định một `Commit Message`. Tuỳ thuộc vào yêu cầu của dự án mà sẽ có các kiểu định dạng khác nhau.

Dưới đây là định dạng của một `Commit Message` bắt buộc phải có trong hệ thống:

```ssh
[emoji] [type]([scope]): [commit msg] (#[issue No.])
```

Ví dụ về một `Commit Message`:

```ssh
🧹 chore(configuration): change the Git Commit Msg by replacing cz-emoji with cz-emoji-conventional (#NOVAID-TEST)
```

#### Emoji

Dưới đây là danh sách `emoji` được sử dụng trong hệ thống:

- ✨: Một tính năng mới.
- 🐛: Sửa đổi một lỗi.
- 📝: Thay đổi tài liệu.
- 💎: Những thay đổi không ảnh hưởng đến ý nghĩa của mã (khoảng trắng, định dạng, thiếu dấu chấm phẩy, v.v.).
- ♻️: Thay đổi mã mà không sửa được lỗi cũng không thêm tính năng.
- 📈: Thay đổi mã giúp cải thiện hiệu suất.
- 🧪: Thêm các bài kiểm tra bị thiếu hoặc sửa các bài kiểm tra hiện có.
- 🏗️: Các thay đổi ảnh hưởng đến hệ thống xây dựng hoặc các yếu tố phụ thuộc bên ngoài (phạm vi ví dụ: gulp, broccoli, npm).
- 📦: Các thay đổi đối với các tập lệnh và tệp cấu hình CI của chúng tôi (phạm vi ví dụ: Travis, Circle, BrowserStack, SauceLabs).
- 🧹: Các thay đổi khác không sửa đổi src hoặc các tệp thử nghiệm.
- ⏪️: Hoàn nguyên một cam kết trước đó.

#### Type

Dưới đây là danh sách `type` được sử dụng trong hệ thống. Mỗi `type` thường tương ứng với một `emoji` cố định:

- `feat`: Một tính năng mới.
- `fix`: Sửa đổi một lỗi.
- `docs`: Thay đổi tài liệu.
- `style`: Những thay đổi không ảnh hưởng đến ý nghĩa của mã (khoảng trắng, định dạng, thiếu dấu chấm phẩy, v.v.).
- `refactor`: Thay đổi mã mà không sửa được lỗi cũng không thêm tính năng.
- `perf`: Thay đổi mã giúp cải thiện hiệu suất.
- `test`: Thêm các bài kiểm tra bị thiếu hoặc sửa các bài kiểm tra hiện có.
- `build:`: Các thay đổi ảnh hưởng đến hệ thống xây dựng hoặc các yếu tố phụ thuộc bên ngoài (phạm vi ví dụ: gulp, broccoli, npm).
- `ci`: Các thay đổi đối với các tập lệnh và tệp cấu hình CI của chúng tôi (phạm vi ví dụ: Travis, Circle, BrowserStack, SauceLabs).
- `chore`: Các thay đổi khác không sửa đổi src hoặc các tệp thử nghiệm.
- `revert`: Hoàn nguyên một cam kết trước đó.

#### Scope

Một `scope` có thể được cung cấp cho `type` của commit msg, để cung cấp thông tin ngữ cảnh bổ sung và được chứa trong dấu ngoặc đơn.

`Scope` có thể rỗng (ví dụ: nếu thay đổi là toàn cục hoặc khó gán cho một thành phần), trong trường hợp đó, dấu ngoặc đơn sẽ bị bỏ qua.

Ví dụ:

```ssh
feat(parser): add ability to parse arrays.
```

#### Description

Một mô tả ngắn về những gì đã được sửa đổi trong cam kết.

Một mô tả ngắn sẽ có số lượng ký tự tối đa. Nếu số lượng ký tự không đủ để mô tả về tất cả các thay đổi trong commit. Hãy viết nó ngắn gọn nhất có thể. Sau đó, những chi tiết của những mô tả này sẽ được trình bày trong phần `Body`.

#### Body

`Body` là mô tả dài hơn và chi tiết hơn, cần thiết khi `Description` chưa thể nói rõ hết được.

#### Breaking changes

`Breaking changes` được xem là một thay đổi đột phá so với trước khi thay đổi. Tất cả các thay đổi vi phạm phải được đề cập ở chân trang với mô tả về thay đổi, lý do và ghi chú về việc chuyển đổi.

Ví dụ dưới đây là việc thay đổi cách sử dụng một `script` so với trước khi thay đổi. Nó cần phải được mô tả rõ ràng:

```ssh
BREAKING CHANGE:

`port-runner` command line option has changed to `runner-port`, so that it is
consistent with the configuration file syntax.

To migrate your project, change all the commands, where you use `--port-runner`
to `--runner-port`.
```

#### Issue references

`Issue references` là những vấn đề liên quan đến việc thay đổi. Thông thường nó sẽ là các `Task Ids`. Trong phạm vi dự án, nó chính là `Jira Task Id`.

Có thể có nhiều vấn đề bị ảnh hưởng trong một commit, được phân cách nhau bằng dấu phẩy (`,`).

```ssh
#NOVAID-TEST
```

Hoặc trong trường hợp có nhiều vấn đề:

```ssh
#NOVAID-TEST1, #NOVAID-TEST2, #NOVAID-TEST3
```

### Sử dụng

```ssh
yarn commit
```

Sau khi chạy lệnh trên, tiến hành nhập nội dung theo thứ tự:

#### Select the type of change that you're committing

Chọn một loại tương ứng với những thay đổi

#### What is the scope of this change (e.g. component or file name)

Nhập nội dung của scope. Đây là một tuỳ chọn, có thể bỏ qua bằng cách nhấn `enter`.

#### Write a short, imperative tense description of the change

Viết một đoạn mô tả ngắn, sử dụng câu mệnh lệnh để mô tả về những thay đổi.

#### Provide a longer description of the change

Nhập một đoạn mô tả chi tiết nếu như `Description` không chứa đủ thông tin. Nếu thông tin mô tả ở `Description` đã đầy đủ thì có thể bỏ qua bước này bằng cách nhấn `enter`.

#### Are there any breaking changes?

Đây là một câu hỏi rằng những thay đổi này có đột phá hay không. Nó là một dạng câu hỏi `Yes/No`.

- `Y` - Sau khi chọn `Yes`. Tiến hành nhập mô tả về những thay đổi đột phá này.
- `N` - Sau khi chọn `No`. Đi qua bước tiếp theo.

#### Does this change affect any open issues?

Đây là một câu hỏi rằng những thay đổi này có ảnh hưởng gì đến những vấn đề đang mở hay không. Những vấn đề đang mở ở đây có thể được hiểu là các `Tickets` được tạo và quản lý ở Jira, và nó phải được liên kết với commit này.

- `Y` - Sau khi chọn `Yes`. Tiến hành nhập `Issue references`.
- `N` - Sau khi chọn `No`. Hoàn thành việc viết một commit message.
