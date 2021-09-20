# PlayFab_GDScriptTemplate README
> PlayFabSDK for GDScript / SDKGenerator Template

This is the template file for generating the PlayFabSDK for GDScript. <br />
To generate PlayFabSDK, follow the steps below.

## Example of manual generation
```bash
# 1)
mkdir PlayFab_GDScriptSdk

# 2)
git clone https://github.com/PlayFab/SDKGenerator
cd SDKGenerator/privateTemplates
git clone https://github.com/MizunagiKB/PlayFab_GDScriptTemplate gdscriptsdk
cd ..

# 3) Generate PlayFabSDK #1
node generate.js gdscriptsdk=../PlayFab_GDScriptSdk -apiSpecGitUrl https://raw.githubusercontent.com/MizunagiKB/API_Specs/master

# 3) Generate PlayFabSDK #2
# *) It will be generated according to the latest PlayFabSDK, but the sdkVersion will be blank.
node generate.js gdscriptsdk=../PlayFab_GDScriptSdk
```

## Actual products

https://github.com/MizunagiKB/PlayFab_GDScriptSdk


## PlayFab API Reference

See below for specific uses of the API.

https://docs.microsoft.com/en-us/gaming/playfab/api-references/
