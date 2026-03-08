# **App Name**: PassMark: University Study Platform

## Core Features:

- Secure User Authentication & Authorization: Implement Firebase Email/password and Google sign-in. Allow users to select 'Student' or 'Tutor' roles during signup. Securely manage access rights with manual assignment for 'Admin' roles in Firestore.
- Past Question Content Management: Provide an Admin-only interface for uploading PDF past questions to Firebase Storage. Categorize and link questions by university, department, course, and year within Firestore, and manage their verification status.
- Student Past Question Access & Search: Enable students to browse and search for past questions by university, department, or course code. Allow filtering by year, and securely provide PDF downloads, restricted to active subscribers via Firebase Storage security rules.
- Subscription & Payment Integration: Integrate with Paystack for processing N2,000 (Standard) and N5,000 (Premium) semester subscriptions, including an auto-renew toggle. Use webhooks to update subscription statuses and expiry dates in Firestore.
- Admin Reporting Dashboard: Display key platform metrics such as total subscribers, active subscriptions, and revenue snapshots, leveraging data from Firestore for administrative overview and management.
- Tutor Profile Creation & Approval: Allow tutors to create detailed profiles, including their bio, hourly rates, and courses they teach. Implement an admin approval workflow in Firestore before tutor profiles become publicly visible.
- AI Exam Focus Tool: A generative AI tool that, given a selected course code and study topic, provides suggested exam questions or highlights key areas to focus on, based on analyzed course materials or general academic trends.

## Style Guidelines:

- Primary color: A deep, professional green (#0F9D58) signifying growth and stability, directly incorporating the user's requested color. This strong hue will be used for main interactive elements, headers, and branding.
- Background color: A very subtle, desaturated green-tinted white (#E1EEDE). This almost-white background promotes a clean, academic feel while subtly carrying the brand's primary hue, optimized for readability and low data usage.
- Accent color: A brighter, lively green (#66DB66) analogous to the primary but distinct enough to draw attention. It will be used for call-to-action buttons, highlights, and secondary interactive elements to provide visual energy and contrast.
- Font choice: 'Inter' (sans-serif) for all text elements. Its modern, clear, and objective aesthetic is perfect for an academic platform, ensuring optimal readability across all device sizes, especially for low-bandwidth users. Note: currently only Google Fonts are supported.
- Utilize simple, line-based vector icons for navigation and key actions. Icons should be highly recognizable and maintain a clean, academic, and minimalist aesthetic, reducing load times and improving clarity.
- Adopt a mobile-first responsive design strategy with clear, logical content hierarchy. Employ generous whitespace to prevent visual clutter and enhance readability. Layouts should adapt gracefully across various screen sizes while maintaining fast loading and low data consumption.
- Incorporate minimal and purposeful animations. Subtle transitions for page navigation, feedback on interactive elements (e.g., button presses), and content loading should be used sparingly to ensure a fluid user experience without hindering performance for low-bandwidth users.