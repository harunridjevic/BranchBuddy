@echo off
"C:\\Users\\R User\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\bin\\cmake.exe" ^
  "-HC:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\node_modules\\react-native\\ReactAndroid\\cmake-utils\\default-app-setup" ^
  "-DCMAKE_SYSTEM_NAME=Android" ^
  "-DCMAKE_EXPORT_COMPILE_COMMANDS=ON" ^
  "-DCMAKE_SYSTEM_VERSION=24" ^
  "-DANDROID_PLATFORM=android-24" ^
  "-DANDROID_ABI=x86" ^
  "-DCMAKE_ANDROID_ARCH_ABI=x86" ^
  "-DANDROID_NDK=C:\\Users\\R User\\AppData\\Local\\Android\\Sdk\\ndk\\26.1.10909125" ^
  "-DCMAKE_ANDROID_NDK=C:\\Users\\R User\\AppData\\Local\\Android\\Sdk\\ndk\\26.1.10909125" ^
  "-DCMAKE_TOOLCHAIN_FILE=C:\\Users\\R User\\AppData\\Local\\Android\\Sdk\\ndk\\26.1.10909125\\build\\cmake\\android.toolchain.cmake" ^
  "-DCMAKE_MAKE_PROGRAM=C:\\Users\\R User\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\bin\\ninja.exe" ^
  "-DCMAKE_LIBRARY_OUTPUT_DIRECTORY=C:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\android\\app\\build\\intermediates\\cxx\\RelWithDebInfo\\1u6518d2\\obj\\x86" ^
  "-DCMAKE_RUNTIME_OUTPUT_DIRECTORY=C:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\android\\app\\build\\intermediates\\cxx\\RelWithDebInfo\\1u6518d2\\obj\\x86" ^
  "-DCMAKE_BUILD_TYPE=RelWithDebInfo" ^
  "-DCMAKE_FIND_ROOT_PATH=C:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\android\\app\\.cxx\\RelWithDebInfo\\1u6518d2\\prefab\\x86\\prefab" ^
  "-BC:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\android\\app\\.cxx\\RelWithDebInfo\\1u6518d2\\x86" ^
  -GNinja ^
  "-DPROJECT_BUILD_DIR=C:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\android\\app\\build" ^
  "-DREACT_ANDROID_DIR=C:\\Users\\R User\\Documents\\software_dev\\BranchBuddy\\node_modules\\react-native\\ReactAndroid" ^
  "-DANDROID_STL=c++_shared" ^
  "-DANDROID_USE_LEGACY_TOOLCHAIN_FILE=ON"