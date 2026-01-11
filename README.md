# CVEFUCK-backend

Бекенд-приложение, написанное на Nest.js

## Установка

Для установки выполнить следующие команды

```bash
  docker build -t cvefuck-backend
  docker create --name cvefuck-backend -p 3000:3000 cvefuck-backend
  docker start cvefuck-backend
```

Для работы также понадобится контейнер с Postgresql (v. 16) и контейнер с Redis (v. 8.4)
Они должены быть созданы и запущены до запуска контейнера cvefuck-backend

## Описание API

### /cves GET

Вернет в случае успеха объект типа :

```json
{
  "statusCode": 200,
  "cves": {
    "count": 15,
    "data": [
      {
        "id": "CVE-2025-15418",
        "published": "2026-01-02T00:15:43.047",
        "description": {
          "en": "A security flaw has been discovered in Open5GS up to 2.7.6. ...",
          "ru": "Google-Translate"
        },
        "baseScore": {
          "cvssMetricV40": 4.8,
          "cvssMetricV31": 3.3,
          "cvssMetricV2": 1.7
        },
        "references": {
          "count": 3,
          "data": [
            "https://github.com/open5gs/open5gs/commit/4e913d21f2c032b187815f063dbab5ebe65fe83a",
            "https://github.com/open5gs/open5gs/issues/4217#issue-3759615968"
          ]
        }
      }
    ]
  }
}
```

Массив cves содержит уязвимости за сегодняшний день

Можно передать в route-параметре число N можно получить список уязвимости за последние N дней
Например :

```Вернет информацию за последние 7 дней
  /cves/7
```

Некоторые поля "baseScrore" могут быть undefined

### /files GET

Получить список файлов
В случае успеха вернет объект типа :

```json
{
  "statusCode": 200,
  "files": {
    "sort": {
      "page": 1,
      "size": 20,
      "order": {
        "id": "asc"
      },
      "tags": {
        "count": 3,
        "data": [
          {
            "id": 5,
            "name": "PDF",
            "color": "#1100ffff"
          },
          {
            "id": 6,
            "name": "LEAK",
            "color": "#3eff38ff"
          },
          ...
        ]
      }
    },
    "count": 20,
    "data": [
      {
        "id": 1,
        "name": "file.txt",
        "size": 10000,
        "download": "http://...",
        "miniature": "http://..."
      },
      ...
    ]
  }
}
```

Параметры tags, size, page, order указываются в query

### /files POST

Загрузит файл на диск и впишет его в базу
В случае успеха вернет 201 и объект типа :

```json
{
  "statusCode": 201,
  "file": {
    "id": 1,
    "name": "file.txt",
    "tags": {
      "count": 3,
      "data": [
        ...
      ]
    },
    "download": "",
    "miniature": ""
  }
}
```

### /files PUT

Примет в Body :

```json
  {
    "tags": {
      "count": 3,
      "data": [
        ...
      ]
    },
    "name": "",
  }
```

Если не указать ни одного поля будет возвращено 400

Указанная информация будет перезаписана

tags это массив id тэгов

Вернет 200 и объект типа :

```json
{
  "statusCode": 201,
  "file": {
    "id": 1,
    "name": "file.txt",
    "tags": {
      "count": 3,
      "data": [1, 2, 3]
    },
    "download": "",
    "miniature": ""
  }
}
```

### /files/:id DELETE

Примет в :id число

Удалит предмет из базы и с диска с таким id

В случае успеха вернет 200 и

```json
{
  "statusCode": 200,
  "file": {
    "id": 1,
    "name": "",
    "tags": {
      "count": 3,
      "data": [
        {
          "id": 1,
          "name": "",
          "color": "#0077ffff"
        },
        ...
      ]
    },
    "size": 10000
  }
}
```

### /tags POST

Создать тэг

Примет в Body :

```json
{
  "name": "",
  "color": "#0077ffff"
}
```

В случае успеха вернет 201 и :

```json
{
  "id": 1,
  "name": "",
  "color": "#0077ffff"
}
```

### /tags/:id DELETE

Примет в :id целое число

Удалит tag с таким id

В случае успеха вернет 200 и :

```json
{
  "statusCode": 200,
  "tag": {
    "id": 1,
    "name": "",
    "color": ""
  }
}
```

### /users/verify POST

Проверит подлинности токена

В Body примет :

```json
{
  "jwtToken": ""
}
```

В случае успеха вернет 200 и :

```json
{
  "statusCode": 200,
  "payload": {
    "id": 1,
    "name": "root",
    "isRoot": true
  }
}
```

### /users/login

Выдаст jwt-Токен

В Body примет :

```json
{
  "userName": "",
  "password": ""
}
```

В случае успеха вернет 200 и :

```json
{
  "statusCode": 200,
  "jwtToken": ""
}
```

### Ошибка

В случае ошибки возвращает объект типа :

```json
{
  "statusCode": 400,
  "reason": {
    "ru": "",
    "en": ""
  },
  "data": {}
}
```

### Лимиты

Указываются в .env

По-умолчанию 10 запросов в минуту

На авторизацию 5

Для /users/verify выключен

### .env

ROOT_PASS пароль рута
PORT порт приложения
DATABASE_URL упл подключения к бд

По-умолчанию

```bash
DATABASE_URL="postgres://USER:PASSWORD@db.prisma.io:5432/?sslmode=require"
```

## License

Бесплатно
