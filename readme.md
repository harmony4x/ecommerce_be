
### Login
    1. Check mail
    2. math password
    3. create AT & RT
    4. generate token
    5. get data return login

### Logout 
    ## Check authentication 
        1. Check userId missing
        2. check user in dbs
        3. get AT
        4. verify token (AT & keyStore) 
        5. check keyStore with this userId if exists req.keyStore = keyStore
        6. Ok all => return next()
    ## Delete _id using keyStore.id


### Get RefreshToken
    # Check refresh token da duoc su dung chua
     1. Neu duoc su dung (check RefreshTokensUsed)
      - Decode token xem la cua User nao
      - Xoa tat ca cac token cua user do (de tranh bi nguoi khac su dung) -> reLogin
     2. Neu chua duoc su dung 
      - check RefreshToken xem la co user nao dang su dung RefreshToken do khong -> neu co thi tiep tuc
      - Decode xem la cua user nao
      - Tao 1 cap AT & RT new
      - Update RT va RT old vao RefreshTokensUsed
