export interface AboutData {
  hero: {
    title: string;
    description: string;
    buttons: {
      projects: string;
      resume: string;
      contact: string;
    };
  };
  sections: {
    selectedWork: string;
  };
  quickFacts: {
    title: string;
    items: { label: string; value: string }[];
  };
  story: {
    title: string;
    paragraphs: string[];
  };
  experience: {
    title: string;
    description: string;
    linkText: string;
  };
  strengths: {
    title: string;
    description: string;
    items: string[];
  };
  skills: {
    title: string;
    categories: {
      name: string;
      items: { name: string; icon?: string }[];
    }[];
  };
  highlights: {
    title: string;
    items: string[];
  };
  focus: {
    title: string;
    description?: string;
    paragraphs: string[];
  };
  writing: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    cta: string;
  };
}

export const aboutData: Record<"en" | "vi" | "zh-cn", AboutData> = {
  en: {
    hero: {
      title: "Hi, I'm Michael.",
      description:
        "I am a product-minded engineer and founder building practical software systems across automation, computer vision, and human-centered AI.",
      buttons: {
        projects: "View Projects",
        resume: "View Resume",
        contact: "Contact Me",
      },
    },
    sections: {
      selectedWork: "Selected Work",
    },
    quickFacts: {
      title: "Quick Facts",
      items: [
        { label: "Focus", value: "AI products, automation, internal tools, computer vision" },
        { label: "Strength", value: "Product judgment paired with hands-on engineering" },
        { label: "Stack", value: "TypeScript, React, Node.js, Python, PostgreSQL" },
        { label: "Working style", value: "Calm systems thinking, practical execution, long-term craft" },
      ],
    },
    story: {
      title: "About Me",
      paragraphs: [
        "Over time, my work has expanded from full-stack applications into AI systems, workflow automation, computer vision, and product development.",
        "I care most about building software that is useful in the real world: tools that reduce busywork, improve clarity, and help people make better decisions.",
        "That has led me toward products that sit close to actual operations, where engineering, product thinking, and long-term maintainability all matter at once.",
      ],
    },
    experience: {
      title: "Experiences & Work",
      description: "Please visit the Work page to see details about my past projects and experiences.",
      linkText: "View my work",
    },
    strengths: {
      title: "Soft Skills",
      description: "",
      items: [
        "Project management",
        "Elevator Pitch",
        "Business communication",
        "Problem solving",
        "Teamwork",
      ],
    },
    skills: {
      title: "Skills & Technologies",
      categories: [
        {
          name: "Frontend",
          items: [
            { name: "React", icon: "react" },
            { name: "Next.js", icon: "nextdotjs" },
            { name: "TypeScript", icon: "typescript" },
            { name: "JavaScript", icon: "javascript" },
            { name: "Tailwind CSS", icon: "tailwindcss" },
            { name: "React Native", icon: "react" },
            { name: "AngularJS", icon: "angular" },
            { name: "Expo", icon: "expo" },
            { name: "shadcn/ui", icon: "shadcnui" },
            { name: "Framer Motion", icon: "framer" }
          ],
        },
        {
          name: "Backend & APIs",
          items: [
            { name: "Node.js", icon: "nodedotjs" },
            { name: "Express.js", icon: "express" },
            { name: "FastAPI", icon: "fastapi" },
            { name: "Django", icon: "django" },
            { name: "C# / .NET", icon: "dotnet" },
            { name: "C++", icon: "cplusplus" },
            { name: "REST API" },
            { name: "GraphQL", icon: "graphql" }
          ],
        },
        {
          name: "Data & AI",
          items: [
            { name: "Python", icon: "python" },
            { name: "PostgreSQL", icon: "postgresql" },
            { name: "MySQL", icon: "mysql" },
            { name: "Microsoft SQL", icon: "microsoftsqlserver" },
            { name: "MongoDB", icon: "mongodb" },
            { name: "Redis", icon: "redis" },
            { name: "Prisma", icon: "prisma" },
            { name: "Kafka", icon: "apachekafka" },
            { name: "Databricks", icon: "databricks" },
            { name: "Snowflake", icon: "snowflake" },
            { name: "PyTorch", icon: "pytorch" },
            { name: "OpenCV", icon: "opencv" },
            { name: "LLM & Generative AI" },
            { name: "RAG" }
          ],
        },
        {
          name: "Cloud & Delivery",
          items: [
            { name: "Docker", icon: "docker" },
            { name: "Kubernetes", icon: "kubernetes" },
            { name: "Terraform", icon: "terraform" },
            { name: "AWS", icon: "amazonaws" },
            { name: "Vercel", icon: "vercel" },
            { name: "Render", icon: "render" },
            { name: "Railway", icon: "railway" },
            { name: "Git", icon: "git" },
            { name: "GitHub", icon: "github" },
            { name: "CI/CD" },
            { name: "Linux", icon: "linux" },
            { name: "Monitoring" },
            { name: "Cloud Deployment" },
            { name: "Enterprise MLOps" },
            { name: "Deployment at Scale" }
          ],
        },
        {
          name: "Architecture",
          items: [
            { name: "System Design" },
            { name: "Availability" },
            { name: "Caching" },
            { name: "Rate Limiting" },
            { name: "Load Balancing" },
            { name: "Microservices" },
            { name: "OOP & SOLID Principles" },
            { name: "Design Patterns" }
          ],
        }
      ],
    },
    highlights: {
      title: "Summary of My Journey",
      items: [
        "Top 15 Worldwide — BFMC 2024 & 2025, an international autonomous vehicle competition focused on AI, computer vision, embedded systems, and self-driving logic.",
        "Co-Founder & CTO at Dynamic Industrial Equipment Company Limited, building technology solutions for industrial equipment, production automation, and AI-powered manufacturing workflows.",
        "Founder of Navin AIF, an AI research and product initiative focused on applying artificial intelligence to software systems, optimization, automation, and practical business use cases.",
        "Founder of YI — OneClick CRM, an AI-agent CRM and workflow automation platform designed for small and medium-sized businesses. The platform provides an AI workflow and integration system that makes building AI workflows much easier and simpler, while helping teams efficiently manage leads, customers, deals, quotes, follow-ups, and business operations.",
        "Beyond business process optimization, I also build technology products for personal productivity, community support, AI research, and human-centered applications, exploring how software and AI can create practical value in both business and everyday life.",
      ],
    },
    focus: {
      title: "Current Focus",
      paragraphs: [
        "I am particularly interested in building practical AI products, automation systems, and internal tools—systems that are not only technically robust but also useful, operable, and closely tied to real business value.",
        "I am always looking for a win-win environment where I can contribute my execution capabilities, sense of responsibility, and drive for continuous improvement, while further developing my technical, product, and leadership skills.",
        "My long-term goal is to become a Product-Minded Engineer—someone who solves problems from first principles to turn ambitious ideas into practical, reliable software systems that make a positive impact on users."
      ],
    },
    writing: {
      title: "Writing & Notes",
      description:
        "I use writing to clarify ideas around software, AI, product development, and the choices that make systems more useful over time.",
    },
    contact: {
      title: "Let's Work Together",
      description:
        "If my work feels relevant to what you're building, I'd be glad to connect and talk through ideas, projects, or possible collaboration.",
      cta: "Contact Me",
    },
  },
  vi: {
    hero: {
      title: "Xin chào, tôi là Michael.",
      description:
        "Tôi là một kỹ sư thiên về sản phẩm và cũng là người xây dựng các hệ thống phần mềm thực tiễn trong mảng tự động hóa, thị giác máy tính và AI lấy con người làm trung tâm.",
      buttons: {
        projects: "Xem dự án",
        resume: "Xem CV",
        contact: "Liên hệ",
      },
    },
    sections: {
      selectedWork: "Dự án tiêu biểu",
    },
    quickFacts: {
      title: "Thông tin nhanh",
      items: [
        { label: "Trọng tâm", value: "Sản phẩm AI, tự động hóa, công cụ nội bộ, thị giác máy tính" },
        { label: "Thế mạnh", value: "Tư duy sản phẩm đi cùng khả năng xây dựng thực tế" },
        { label: "Công nghệ", value: "TypeScript, React, Node.js, Python, PostgreSQL" },
        { label: "Cách làm việc", value: "Bình tĩnh, có hệ thống, ưu tiên giá trị thật" },
      ],
    },
    story: {
      title: "Về tôi",
      paragraphs: [
        "Qua thời gian, công việc của tôi mở rộng từ các ứng dụng full-stack sang hệ thống AI, tự động hóa quy trình, thị giác máy tính và phát triển sản phẩm.",
        "Điều tôi quan tâm nhất là làm ra phần mềm hữu ích trong đời sống thật: những công cụ giúp giảm việc lặp lại, tăng độ rõ ràng và hỗ trợ con người đưa ra quyết định tốt hơn.",
        "Vì vậy tôi thường bị hút về các sản phẩm nằm gần vận hành thực tế, nơi kỹ thuật, tư duy sản phẩm và độ bền dài hạn đều quan trọng như nhau.",
      ],
    },
    experience: {
      title: "Kinh nghiệm & Dự án",
      description: "Vui lòng xem tại trang Dự án (Work) để biết thêm chi tiết về các công việc và dự án trước đây của tôi.",
      linkText: "Xem các dự án",
    },
    strengths: {
      title: "Kỹ năng mềm",
      description: "",
      items: [
        "Quản lý dự án",
        "Kỹ năng thuyết trình (Elevator Pitch)",
        "Giao tiếp kinh doanh",
        "Giải quyết vấn đề",
        "Làm việc nhóm",
      ],
    },
    skills: {
      title: "Kỹ năng & công nghệ",
      categories: [
        {
          name: "Frontend",
          items: [
            { name: "React", icon: "react" },
            { name: "Next.js", icon: "nextdotjs" },
            { name: "TypeScript", icon: "typescript" },
            { name: "JavaScript", icon: "javascript" },
            { name: "Tailwind CSS", icon: "tailwindcss" },
            { name: "React Native", icon: "react" },
            { name: "AngularJS", icon: "angular" },
            { name: "Expo", icon: "expo" },
            { name: "shadcn/ui", icon: "shadcnui" },
            { name: "Framer Motion", icon: "framer" }
          ],
        },
        {
          name: "Backend & API",
          items: [
            { name: "Node.js", icon: "nodedotjs" },
            { name: "Express.js", icon: "express" },
            { name: "FastAPI", icon: "fastapi" },
            { name: "Django", icon: "django" },
            { name: "C# / .NET", icon: "dotnet" },
            { name: "C++", icon: "cplusplus" },
            { name: "REST API" },
            { name: "GraphQL", icon: "graphql" }
          ],
        },
        {
          name: "Dữ liệu & AI",
          items: [
            { name: "Python", icon: "python" },
            { name: "PostgreSQL", icon: "postgresql" },
            { name: "MySQL", icon: "mysql" },
            { name: "Microsoft SQL", icon: "microsoftsqlserver" },
            { name: "MongoDB", icon: "mongodb" },
            { name: "Redis", icon: "redis" },
            { name: "Prisma", icon: "prisma" },
            { name: "Kafka", icon: "apachekafka" },
            { name: "Databricks", icon: "databricks" },
            { name: "Snowflake", icon: "snowflake" },
            { name: "PyTorch", icon: "pytorch" },
            { name: "OpenCV", icon: "opencv" },
            { name: "LLM & Generative AI" },
            { name: "RAG" }
          ],
        },
        {
          name: "Cloud & Delivery",
          items: [
            { name: "Docker", icon: "docker" },
            { name: "Kubernetes", icon: "kubernetes" },
            { name: "Terraform", icon: "terraform" },
            { name: "AWS", icon: "amazonaws" },
            { name: "Vercel", icon: "vercel" },
            { name: "Render", icon: "render" },
            { name: "Railway", icon: "railway" },
            { name: "Git", icon: "git" },
            { name: "GitHub", icon: "github" },
            { name: "CI/CD" },
            { name: "Linux", icon: "linux" },
            { name: "Monitoring" },
            { name: "Cloud Deployment" },
            { name: "Enterprise MLOps" },
            { name: "Deployment at Scale" }
          ],
        },
        {
          name: "Kiến trúc hệ thống",
          items: [
            { name: "System Design" },
            { name: "Availability" },
            { name: "Caching" },
            { name: "Rate Limiting" },
            { name: "Load Balancing" },
            { name: "Microservices" },
            { name: "OOP & SOLID Principles" },
            { name: "Design Patterns" }
          ],
        }
      ],
    },
    highlights: {
      title: "Tóm tắt hành trình của tôi",
      items: [
        "Top 15 Toàn cầu — BFMC 2024 & 2025, cuộc thi xe tự hành quốc tế tập trung vào AI, thị giác máy tính, hệ thống nhúng và logic lái tự động.",
        "Đồng sáng lập & CTO tại Công ty TNHH Thiết bị Công nghiệp Dynamic, xây dựng các giải pháp công nghệ cho thiết bị công nghiệp, tự động hóa sản xuất và quy trình sản xuất ứng dụng AI.",
        "Nhà sáng lập Navin AIF, một sáng kiến nghiên cứu và sản phẩm AI tập trung vào việc áp dụng trí tuệ nhân tạo vào hệ thống phần mềm, tối ưu hóa, tự động hóa và các ứng dụng doanh nghiệp thực tế.",
        "Nhà sáng lập YI — OneClick CRM, một nền tảng CRM và tự động hóa quy trình làm việc tích hợp AI agent dành cho doanh nghiệp vừa và nhỏ. Nền tảng cung cấp hệ thống AI workflow và integrations, giúp việc xây dựng các luồng công việc AI trở nên dễ dàng và đơn giản hơn, đồng thời hỗ trợ quản lý khách hàng tiềm năng, khách hàng, giao dịch, báo giá, theo dõi và hoạt động kinh doanh hiệu quả.",
        "Bên cạnh việc tối ưu hóa quy trình doanh nghiệp, tôi cũng xây dựng các sản phẩm công nghệ phục vụ năng suất cá nhân, hỗ trợ cộng đồng, nghiên cứu AI và các ứng dụng lấy con người làm trung tâm, nhằm khám phá cách phần mềm và AI có thể tạo ra giá trị thực tế trong cả kinh doanh lẫn đời sống thường ngày.",
      ],
    },
    focus: {
      title: "Mối quan tâm hiện tại",
      paragraphs: [
        "Tôi đặc biệt hứng thú với việc xây dựng các sản phẩm AI thực tiễn, hệ thống tự động hóa và công cụ nội bộ – những hệ thống không chỉ mạnh mẽ về mặt kỹ thuật mà còn hữu ích, dễ vận hành và gắn liền với giá trị thực tế của doanh nghiệp.",
        "Tôi luôn tìm kiếm một môi trường Win-Win, nơi tôi có thể đóng góp năng lực thực thi, tinh thần trách nhiệm và sự cải tiến liên tục; đồng thời không ngừng phát triển kỹ năng chuyên môn, tư duy sản phẩm và năng lực lãnh đạo.",
        "Mục tiêu dài hạn của tôi là trở thành một Kỹ sư định hướng Sản phẩm (Product-Minded Engineer) – người giải quyết vấn đề từ những nguyên tắc cốt lõi (first principles) để biến các ý tưởng tham vọng thành những hệ thống phần mềm thiết thực, đáng tin cậy và mang lại tác động tích cực cho người dùng."
      ],
    },
    writing: {
      title: "Viết & ghi chép",
      description:
        "Tôi dùng việc viết để làm rõ suy nghĩ của mình về phần mềm, AI, phát triển sản phẩm và những lựa chọn giúp hệ thống hữu ích hơn theo thời gian.",
    },
    contact: {
      title: "Cùng làm việc",
      description:
        "Nếu bạn thấy công việc của tôi phù hợp với điều mình đang xây dựng, tôi rất sẵn lòng kết nối để trao đổi thêm về ý tưởng, dự án hoặc cơ hội hợp tác.",
      cta: "Liên hệ",
    },
  },
  "zh-cn": {
    hero: {
      title: "你好，我是 Michael。",
      description:
        "我是一名偏产品方向的工程师，也是一位持续构建实用软件系统的人，主要专注于自动化、计算机视觉与以人为中心的 AI。",
      buttons: {
        projects: "查看项目",
        resume: "查看简历",
        contact: "联系我",
      },
    },
    sections: {
      selectedWork: "代表项目",
    },
    quickFacts: {
      title: "快速概览",
      items: [
        { label: "关注方向", value: "AI 产品、自动化、内部工具、计算机视觉" },
        { label: "核心优势", value: "产品判断力与工程落地能力并重" },
        { label: "技术栈", value: "TypeScript、React、Node.js、Python、PostgreSQL" },
        { label: "工作方式", value: "冷静、系统化、重视真实价值" },
      ],
    },
    story: {
      title: "关于我",
      paragraphs: [
        "这些年，我的工作已经从全栈应用扩展到 AI 系统、流程自动化、计算机视觉与产品开发。",
        "我最在意的是做出真正有用的软件：能减少重复劳动、提升清晰度，并帮助人做出更好判断的工具。",
        "因此，我常常被贴近真实运营场景的产品吸引，因为在那种环境里，工程实现、产品思考与长期可维护性必须同时成立。",
      ],
    },
    experience: {
      title: "经历与项目",
      description: "请访问 Work 页面查看有关我过往项目与经历的详细信息。",
      linkText: "查看我的项目",
    },
    strengths: {
      title: "软技能",
      description: "",
      items: [
        "项目管理",
        "电梯演讲 (Elevator Pitch)",
        "商业沟通",
        "解决问题",
        "团队合作",
      ],
    },
    skills: {
      title: "技能与技术",
      categories: [
        {
          name: "前端",
          items: [
            { name: "React", icon: "react" },
            { name: "Next.js", icon: "nextdotjs" },
            { name: "TypeScript", icon: "typescript" },
            { name: "JavaScript", icon: "javascript" },
            { name: "Tailwind CSS", icon: "tailwindcss" },
            { name: "React Native", icon: "react" },
            { name: "AngularJS", icon: "angular" },
            { name: "Expo", icon: "expo" },
            { name: "shadcn/ui", icon: "shadcnui" },
            { name: "Framer Motion", icon: "framer" }
          ],
        },
        {
          name: "后端与 API",
          items: [
            { name: "Node.js", icon: "nodedotjs" },
            { name: "Express.js", icon: "express" },
            { name: "FastAPI", icon: "fastapi" },
            { name: "Django", icon: "django" },
            { name: "C# / .NET", icon: "dotnet" },
            { name: "C++", icon: "cplusplus" },
            { name: "REST API" },
            { name: "GraphQL", icon: "graphql" }
          ],
        },
        {
          name: "数据与 AI",
          items: [
            { name: "Python", icon: "python" },
            { name: "PostgreSQL", icon: "postgresql" },
            { name: "MySQL", icon: "mysql" },
            { name: "Microsoft SQL", icon: "microsoftsqlserver" },
            { name: "MongoDB", icon: "mongodb" },
            { name: "Redis", icon: "redis" },
            { name: "Prisma", icon: "prisma" },
            { name: "Kafka", icon: "apachekafka" },
            { name: "Databricks", icon: "databricks" },
            { name: "Snowflake", icon: "snowflake" },
            { name: "PyTorch", icon: "pytorch" },
            { name: "OpenCV", icon: "opencv" },
            { name: "LLM & Generative AI" },
            { name: "RAG" }
          ],
        },
        {
          name: "云与交付",
          items: [
            { name: "Docker", icon: "docker" },
            { name: "Kubernetes", icon: "kubernetes" },
            { name: "Terraform", icon: "terraform" },
            { name: "AWS", icon: "amazonaws" },
            { name: "Vercel", icon: "vercel" },
            { name: "Render", icon: "render" },
            { name: "Railway", icon: "railway" },
            { name: "Git", icon: "git" },
            { name: "GitHub", icon: "github" },
            { name: "CI/CD" },
            { name: "Linux", icon: "linux" },
            { name: "Monitoring" },
            { name: "Cloud Deployment" },
            { name: "Enterprise MLOps" },
            { name: "Deployment at Scale" }
          ],
        },
        {
          name: "系统架构",
          items: [
            { name: "System Design" },
            { name: "Availability" },
            { name: "Caching" },
            { name: "Rate Limiting" },
            { name: "Load Balancing" },
            { name: "Microservices" },
            { name: "OOP & SOLID Principles" },
            { name: "Design Patterns" }
          ],
        }
      ],
    },
    highlights: {
      title: "我的旅程总结",
      items: [
        "全球前 15 名 — BFMC 2024 & 2025，一项专注于 AI、计算机视觉、嵌入式系统和自动驾驶逻辑的国际自动驾驶汽车竞赛。",
        "Dynamic Industrial Equipment Company Limited 联合创始人兼 CTO，为工业设备、生产自动化和 AI 驱动的制造工作流构建技术解决方案。",
        "Navin AIF 创始人，这是一项 AI 研究和产品计划，专注于将人工智能应用于软件系统、优化、自动化以及实际的商业场景。",
        "YI — OneClick CRM 创始人，这是一个专为中小型企业设计的 AI 代理 CRM 和工作流自动化平台。该平台提供了 AI 工作流与集成系统，让构建 AI 工作流变得更加轻松简单，同时帮助团队更高效地管理潜在客户、客户、交易、报价、跟进和业务运营。",
        "除了业务流程优化，我还构建用于个人生产力、社区支持、AI 研究和以人为本的应用的技术产品，探索软件和 AI 如何在商业和日常生活中创造实际价值。",
      ],
    },
    focus: {
      title: "当前关注",
      paragraphs: [
        "我特别热衷于构建实用的 AI 产品、自动化系统和内部工具——这些系统不仅在技术上需要稳健，更重要的是必须实用、易于运维，并与实际的业务价值紧密相连。",
        "我一直在寻找一个双赢的环境，在那里我可以通过出色的执行力、责任心和持续改进的动力来创造价值，同时不断提升自己的技术、产品和领导能力。",
        "我的长期目标是成为一名具备产品思维的工程师（Product-Minded Engineer），能够从第一性原理出发解决实际问题，将宏大的构想转化为实用、可靠且能为用户带来积极影响的软件系统。"
      ],
    },
    writing: {
      title: "写作与笔记",
      description:
        "我会通过写作来整理自己对软件、AI、产品开发，以及让系统长期更有用的关键选择的理解。",
    },
    contact: {
      title: "一起合作",
      description:
        "如果你正在做的事情与我的工作方向契合，我很乐意进一步交流想法、项目，或潜在的合作机会。",
      cta: "联系我",
    },
  },
};
