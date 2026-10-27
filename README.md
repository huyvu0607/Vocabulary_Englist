# Vocabulary_Englist
Trang web ôn từ vựng tiếng Anh ở Wall Street English.

## Cấu trúc

- `frontend/`: ứng dụng web (React + Vite).

## Cách chạy

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ mà Vite in ra (mặc định http://localhost:5173).

## Cách điền .env

1. File `.env` nằm trong `frontend/` và đã được tạo sẵn (bị bỏ qua bởi Git).
2. Mở `frontend/.env` và điền giá trị thật vào hai biến:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- `VITE_SUPABASE_URL`: URL dự án Supabase (Supabase → Project Settings → API).
- `VITE_SUPABASE_ANON_KEY`: khóa công khai `anon` (public). Không dùng khóa `service_role` ở frontend.

Sau khi điền xong, khởi động lại `npm run dev` để Vite đọc lại biến môi trường.
