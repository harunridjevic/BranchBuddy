if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/R User/.gradle/caches/8.10.2/transforms/d6d1c7a488269a3e16bdbb655ad449db/transformed/hermes-android-0.76.3-release/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/R User/.gradle/caches/8.10.2/transforms/d6d1c7a488269a3e16bdbb655ad449db/transformed/hermes-android-0.76.3-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

