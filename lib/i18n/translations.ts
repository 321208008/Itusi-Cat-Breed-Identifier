export const translations = {
  zh: {
    common: {
      darkMode: "深色模式",
      lightMode: "浅色模式",
      language: "语言"
    },
    footer: {
      rights: "保留所有权利"
    },
    home: {
      title: "猫咪品种识别",
      subtitle: "点击上传或拖拽图片到此处，让 AI 帮您识别猫咪品种",
      uploadButton: "选择图片",
      dropHere: "放开图片开始识别",
      loading: "正在识别猫咪品种...",
      tryAgain: "重试"
    },
    error: {
      analysis: "很抱歉，识别失败了，请重新尝试",
      upload: "图片上传失败，请检查图片后重试",
      noImageData: "请选择一张清晰的猫咪图片",
      invalidRequest: "请求格式有误，请重试",
      invalidImageFormat: "只支持图片文件，请重新选择",
      imageProcessing: "图片处理出错，请换一张图片试试",
      aiService: "AI 服务暂时休息了，请稍后再试",
      noAnalysisResult: "没有获取到分析结果，请重试",
      resultParsing: "结果解析失败，请重新尝试",
      unknown: "遇到了一些问题，请重新尝试"
    },
    result: {
      breed: "猫咪品种",
      confidence: "识别可信度",
      description: "特征描述",
      reset: "识别新图片",
      tryAgain: "重新识别"
    },
    cats: {
      breeds: {
        "Abyssinian": "阿比西尼亚猫",
        "American Shorthair": "美国短毛猫",
        "Bengal": "孟加拉豹猫",
        "British Shorthair": "英国短毛猫",
        "Exotic Shorthair": "异国短毛猫",
        "Maine Coon": "缅因猫",
        "Norwegian Forest Cat": "挪威森林猫",
        "Persian": "波斯猫",
        "Ragdoll": "布偶猫",
        "Russian Blue": "俄罗斯蓝猫",
        "Scottish Fold": "苏格兰折耳猫",
        "Siamese": "暹罗猫",
        "Sphynx": "斯芬克斯猫",
        "Turkish Angora": "安哥拉猫"
      },
      features: {
        "long_hair": "长毛",
        "short_hair": "短毛",
        "pointed": "重点色",
        "solid": "纯色",
        "tabby": "虎斑",
        "spotted": "斑点",
        "bi_color": "双色",
        "tri_color": "三色",
        "large": "体型大",
        "medium": "体型中等",
        "small": "体型小",
        "muscular": "肌肉发达",
        "slender": "体型苗条",
        "round_face": "圆脸",
        "long_face": "长脸",
        "folded_ears": "折耳",
        "straight_ears": "直立耳",
        "blue_eyes": "蓝眼睛",
        "green_eyes": "绿眼睛",
        "orange_eyes": "橙眼睛",
        "copper_eyes": "铜色眼睛"
      }
    }
  },
  en: {
    common: {
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      language: "Language"
    },
    footer: {
      rights: "All Rights Reserved"
    },
    home: {
      title: "Cat Breed Identifier",
      subtitle: "Upload or drag an image here, let AI identify the cat breed",
      uploadButton: "Choose Image",
      dropHere: "Drop image to start",
      loading: "Identifying cat breed...",
      tryAgain: "Try Again"
    },
    error: {
      analysis: "Sorry, identification failed. Please try again",
      upload: "Image upload failed, please check and retry",
      noImageData: "Please select a clear cat image",
      invalidRequest: "Invalid request format, please retry",
      invalidImageFormat: "Only image files are supported",
      imageProcessing: "Image processing error, please try another image",
      aiService: "AI service is temporarily unavailable, please try again later",
      noAnalysisResult: "No analysis result received, please retry",
      resultParsing: "Result parsing failed, please try again",
      unknown: "Something went wrong, please try again"
    },
    result: {
      breed: "Cat Breed",
      confidence: "Confidence",
      description: "Features",
      reset: "Identify New Image",
      tryAgain: "Try Again"
    },
    cats: {
      breeds: {
        "Abyssinian": "Abyssinian",
        "American Shorthair": "American Shorthair",
        "Bengal": "Bengal",
        "British Shorthair": "British Shorthair",
        "Exotic Shorthair": "Exotic Shorthair",
        "Maine Coon": "Maine Coon",
        "Norwegian Forest Cat": "Norwegian Forest Cat",
        "Persian": "Persian",
        "Ragdoll": "Ragdoll",
        "Russian Blue": "Russian Blue",
        "Scottish Fold": "Scottish Fold",
        "Siamese": "Siamese",
        "Sphynx": "Sphynx",
        "Turkish Angora": "Turkish Angora"
      },
      features: {
        "long_hair": "Long Hair",
        "short_hair": "Short Hair",
        "pointed": "Pointed Pattern",
        "solid": "Solid Color",
        "tabby": "Tabby Pattern",
        "spotted": "Spotted Pattern",
        "bi_color": "Bi-Color",
        "tri_color": "Tri-Color",
        "large": "Large Size",
        "medium": "Medium Size",
        "small": "Small Size",
        "muscular": "Muscular Build",
        "slender": "Slender Build",
        "round_face": "Round Face",
        "long_face": "Long Face",
        "folded_ears": "Folded Ears",
        "straight_ears": "Straight Ears",
        "blue_eyes": "Blue Eyes",
        "green_eyes": "Green Eyes",
        "orange_eyes": "Orange Eyes",
        "copper_eyes": "Copper Eyes"
      }
    }
  }
} as const; 