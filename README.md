# Backend

To start server **with** auto update

```
npm start
```

To start server without auto update

```
node ./index.js
```

server port: `5000`

# Documentation List

[-Customer](#documentation-customer)

[-Admin](#documentation-admin)

[-Restaurant](#documentation-restaurant)

[-Order](#documentation-order)

# Documentation (Customer)

[Return to top](#backend)

## Sign up

#### URL:

```
POST /customer/signup
```

#### Header

- N/A

#### Body

- `username`: String (unique)
- `password`: String
- `email`: String
- `phoneNum`: String
- `profile`: File (jpg/jpeg/jfif/png)

#### Return(json)

- `UserAlreadyExisted`
- `FileExtensionError`
- `SignupSuccessAndVerificationEmailSent`

## Activate

#### URL

```
POST /customer/activate
```

#### Header

- `Content-type: application/json`

#### Body

- `username`: String (unique)
- `otp`: Integer (6 digit)

#### Return(json)

- `token`
- `UserNotExist`
- `AlreadyActivated`
- `OtpNotFound`
- `OtpExpired`
- `TooMuchTrials`
- `InvalidOtp`
- `PendingOtp`
- `VerificationEmailSent`

## Reverify

#### URL

```
POST /customer/reverify
```

#### Header

- `Content-type: application/json`

#### Body

- `username`: String (unique)
- `email`: String

#### Return(json)

- `OtpNotFound`
- `PendingOtp`
- `VerificationEmailSent`

## Signin

#### URL

```
POST /customer/signin
```

#### Header

- `Content-type: application/json`

#### Body

- `username`: String (unique)
- `password`: String

#### Return(json)

- `token`
- `AccountNotActivatedAndPendingOtp`
- `AccountNotActivatedAndVerificationEmailSent`
- `UserNotFound`
- `InvalidPassword`

## Change password

#### URL

```
POST /customer/changePw
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `passwordOld`: String
- `passwordNew`: String

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `UserNotExist`
- `InvalidPassword`
- `DuplicatedNewPassword`
- `LengthTooShort`
- `SuccessfullyChangedPassword`

## Get single customer data

#### URL

```
GET /customer/data
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return(json)

- json of username, phoneNum, email, points, profilePic

## Logout

#### URL

```
POST /customer/logout
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `SuccessfullyLogout`

## Set Profile Picture

#### URL

```
POST /customer/profilePic
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- `profile`: File (jpg/jpeg/jfif/png)

#### Return(json)

- `ChangedProfilePic`
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `FileExtensionError`

## Get Profile Picture

#### URL

```
GET /customer/profilePic
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return(json)

- File buffer
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`

## Other requests

#### Return(json)

- `Forbidden`

# Documentation (Admin)

[Return to top](#backend)

## Signin

#### URL

```
POST /admin/signin
```

#### Header

- `Content-type: application/json`

#### Body

- `username`: String (unique)
- `password`: String

#### Return(json)

- `token`
- `UserNotFound`

## Get all customer data

```
GET /admin/customer/all
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- array of customer data

## Reset a customer password

```
POST /admin/customer/resetPw
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `username`: String
- `passwordNew`: String

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `UserNotExist`
- `LengthTooShort`
- `SuccessfullyResetPassword`

## Approve restaurant signup request

```
POST /admin/restaurant/approve
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `username`: String

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `UserNotExist`
- `AccountApprovedAndApprovalEmailSent`

## Reject restaurant signup request

```
POST /admin/restaurant/reject
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `username`: String
- `reason`: String

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `UserNotExist`
- `AccountRejectedAndRejectEmailSent`

## Get all restaurant data

```
GET /admin/restaurant/all
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- array of restaurant data

## Reset a restaurant password

```
POST /admin/restaurant/resetPw
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `username`: String
- `passwordNew`: String

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `LengthTooShort`
- `SuccessfullyResetPassword`

# Documentation (Restaurant)

[Return to top](#backend)

## Signup

#### URL

```
POST /restaurant/signup
```

#### Header

- `Content-type: application/json`

#### Body

- `username`: String (Unique),
- `restaurantName`: String,
- `password`: String,
- `email`: String,
- `address`: String,
- `licenseNum`: String,
- `profile`: File (jpg/jpeg/jfif/png)

#### Return

- `UserAlreadyExisted`
- `FileExtensionError`
- `RegisterationReceived`

## Signin

#### URL

```
POST /restaurant/signin
```

#### Header

- `Content-type: application/json`

#### Body

- `username`: String,
- `password`: String

#### Return

- `token`
- `AccountNotApproved`
- `UserNotFound`
- `InvalidPassword`

## Change password

#### URL

```
POST /restaurant/changePw
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `passwordOld`: String
- `passwordNew`: String

#### Return(json)

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `UserNotExist`
- `InvalidPassword`
- `DuplicatedNewPassword`
- `LengthTooShort`
- `SuccessfullyChangedPassword`

## Get single restaurant data

#### URL

```
GET /restaurant/data
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

- Restaurant Json document

## Get all approved restaurant data

#### URL

```
GET /restaurant/all
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

- Array of activated restaurant JSON documents

## Get all not approved restaurant data

#### URL

```
GET /restaurant/notApproved
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

- Array of not activated restaurant Json documents

## Logout

#### URL

```
POST /restaurant/logout
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

- `SuccessfullyLogout`

## Set profile picture

#### URL

```
POST /restaurant/profilePic
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- `profile`: File (jpg/jpeg/jfif/png)

#### Return

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `FileExtensionError`

## Get profile picture

#### URL

```
GET /restaurant/profilePic
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

- File buffer
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`

## Add an item to menu

#### URL

```
POST /restaurant/food
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `foodPic` : File (jpg/jpeg/jfif/png),
- `name` : String,
- `price` : Number,
- `style` : String

#### Return

- `AddedFoodItemSuccessfully`
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`

## Remove an item from menu

#### URL

```
DELETE /restaurant/food
```

#### Header

- `Content-type: application/json`
- `Authorization: Bearer <token>`

#### Body

- `foodId` : ObjectId of food item

#### Return

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `FoodNotFound`
- `RemovedFoodItemSuccessfully`

# Documentation (Order)

[Return to top](#backend)

## Fetch order from the respective restaurant

#### URL

```
GET /order/fetchByRestaurant
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

-`List of orders, for which items is aggregate with food item to provide more detail`

## Fetch order from the respective customer

#### URL

```
GET /order/fetchByCustomer
```

#### Header

- `Authorization: Bearer <token>`

#### Body

- N/A

#### Return

-`List of orders, for which items is populate with food item to provide more detail`

## Create new order and update customer points

#### URL

```
POST /order/add
```

#### Header

- `Authorization: Bearer <token>`
- `Content-type: application/json`

#### Body

- restaurantID: Restaurant ObjectId (String)
- items: Array of food Item ObjectId (String)
- total: Real
- couponUsed: Integer
- netTotal: Real

#### Return

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `UserNotExist`
- `EmptyOrderError`
- `NotEnoughPointsForCoupon`
- `AmountMismatchedAndRejectOrder`
- The order document

## Finished an Order

#### URL

```
POST /order/done
```

#### Header

- `Authorization: Bearer <token>`
- `Content-type: application/json`

#### Body

- orderNo : String

#### Return

- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `OrderAlreadyFinished`
- `Order (Order_id) status have been updated`
