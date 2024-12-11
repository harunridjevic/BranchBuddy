@echo off
"C:\\Program Files\\Java\\jdk-23\\bin\\java" ^
  --class-path ^
  "C:\\Users\\R User\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  x86_64 ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  26 ^
  --output ^
  "C:\\Users\\RUSER~1\\AppData\\Local\\Temp\\agp-prefab-staging3833424075979185620\\staged-cli-output" ^
  "C:\\Users\\R User\\.gradle\\caches\\8.10.2\\transforms\\d5037f6fbd65df0db19a8e55cde8bb78\\transformed\\react-android-0.76.3-release\\prefab" ^
  "C:\\Users\\R User\\.gradle\\caches\\8.10.2\\transforms\\d6d1c7a488269a3e16bdbb655ad449db\\transformed\\hermes-android-0.76.3-release\\prefab" ^
  "C:\\Users\\R User\\.gradle\\caches\\8.10.2\\transforms\\8b60b4f75564ac53567672df7a1c9a73\\transformed\\fbjni-0.6.0\\prefab"
