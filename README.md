# tech-shop-web
## Project overview
```
.
├── backend
│   ├── HELP.md
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── example
│   │   │   │           └── shop
│   │   │   │               ├── configs
│   │   │   │               │   └── foo
│   │   │   │               ├── controllers
│   │   │   │               │   └── foo
│   │   │   │               ├── DataInitializer.java
│   │   │   │               ├── exceptions
│   │   │   │               │   └── foo
│   │   │   │               ├── models
│   │   │   │               │   ├── AppRole.java
│   │   │   │               │   ├── Role.java
│   │   │   │               │   └── User.java
│   │   │   │               ├── payloads
│   │   │   │               │   └── foo
│   │   │   │               ├── repositories
│   │   │   │               │   ├── RoleRepository.java
│   │   │   │               │   └── UserRepository.java
│   │   │   │               ├── security
│   │   │   │               │   ├── jwt
│   │   │   │               │   │   ├── AuthEntryPointJwt.java
│   │   │   │               │   │   ├── AuthTokenFilter.java
│   │   │   │               │   │   └── JwtUtils.java
│   │   │   │               │   ├── request
│   │   │   │               │   │   ├── LoginRequest.java
│   │   │   │               │   │   ├── SignupRequest.java
│   │   │   │               │   │   └── UpdateProfileRequest.java
│   │   │   │               │   ├── response
│   │   │   │               │   │   ├── AuthenticationResult.java
│   │   │   │               │   │   ├── MessageResponse.java
│   │   │   │               │   │   └── UserInfoResponse.java
│   │   │   │               │   ├── SecurityConfigs.java
│   │   │   │               │   └── service
│   │   │   │               │       ├── UserDetailsImpl.java
│   │   │   │               │       └── UserDetailsServiceImpl.java
│   │   │   │               ├── services
│   │   │   │               │   └── foo
│   │   │   │               └── ShopApplication.java
│   │   │   └── resources
│   │   │       ├── application.properties
│   │   │       ├── static
│   │   │       └── templates
│   │   └── test
│   │       └── java
│   │           └── com
│   │               └── example
│   │                   └── shop
│   │                       └── ShopApplicationTests.java
│   └── target
│       ├── classes
│       │   ├── application.properties
│       │   └── com
│       │       └── example
│       │           └── shop
│       │               └── ShopApplication.class
│       ├── generated-sources
│       │   └── annotations
│       ├── generated-test-sources
│       │   └── test-annotations
│       ├── maven-status
│       │   └── maven-compiler-plugin
│       │       ├── compile
│       │       │   └── default-compile
│       │       │       ├── createdFiles.lst
│       │       │       └── inputFiles.lst
│       │       └── testCompile
│       │           └── default-testCompile
│       │               ├── createdFiles.lst
│       │               └── inputFiles.lst
│       ├── surefire-reports
│       │   ├── com.example.shop.ShopApplicationTests.txt
│       │   └── TEST-com.example.shop.ShopApplicationTests.xml
│       └── test-classes
│           └── com
│               └── example
│                   └── shop
│                       └── ShopApplicationTests.class
└── README.md

48 directories, 40 files

```