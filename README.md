# AgentForge - AI Agent Builder Platform

Build, deploy, and manage AI agents with ease. AgentForge provides a visual interface for creating intelligent conversational agents powered by multiple AI models.

## Features

- **Visual Agent Builder** - Create and configure AI agents with an intuitive dashboard
- - **Multi-Model Support** - GPT-4, GPT-3.5 Turbo, Claude 3 Opus, Claude 3 Sonnet
  - - **Real-time Chat Testing** - Test your agents directly in the browser
    - - **API Key Management** - Generate API keys for programmatic agent access
      - - **Conversation History** - Track and review all agent conversations
        - - **User Authentication** - Secure JWT-based auth with registration and login
          - - **Dark Theme UI** - Modern dark interface built with Tailwind CSS
           
            - ## Tech Stack
           
            - - **Framework**: Next.js 14 (App Router)
              - - **Language**: TypeScript
                - - **Database**: PostgreSQL (Neon)
                  - - **ORM**: Prisma
                    - - **Styling**: Tailwind CSS
                      - - **Auth**: JWT (jose + bcryptjs)
                        - - **Validation**: Zod
                          - - **Deployment**: Vercel
                           
                            - ## Getting Started
                           
                            - ### Prerequisites
                           
                            - - Node.js 18+
                              - - PostgreSQL database (Neon recommended)
                               
                                - ### Installation
                               
                                - 1. Clone the repository:
                                  2. ```bash
                                     git clone https://github.com/amhisarza-dotcom/agentforge.git
                                     cd agentforge
                                     ```

                                     2. Install dependencies:
                                     3. ```bash
                                        npm install
                                        ```

                                        3. Set up environment variables:
                                        4. ```bash
                                           cp .env.example .env
                                           ```

                                           4. Update `.env` with your database credentials and JWT secret.
                                          
                                           5. 5. Push the database schema:
                                              6. ```bash
                                                 npx prisma db push
                                                 ```

                                                 6. Run the development server:
                                                 7. ```bash
                                                    npm run dev
                                                    ```

                                                    Open [http://localhost:3000](http://localhost:3000) to see the app.

                                                    ## Project Structure

                                                    ```
                                                    agentforge/
                                                    ├── app/
                                                    │   ├── (auth)/           # Login & Register pages
                                                    │   ├── api/              # API routes
                                                    │   │   ├── auth/         # Auth endpoints
                                                    │   │   ├── agents/       # Agent CRUD + chat
                                                    │   │   └── user/         # Profile, password, API keys
                                                    │   ├── dashboard/        # Dashboard pages
                                                    │   │   ├── agents/       # Agent management
                                                    │   │   └── settings/     # User settings
                                                    │   ├── globals.css       # Global styles
                                                    │   ├── layout.tsx        # Root layout
                                                    │   └── page.tsx          # Landing page
                                                    ├── components/ui/        # Reusable UI components
                                                    ├── lib/                  # Utilities (db, auth)
                                                    ├── prisma/               # Database schema
                                                    └── middleware.ts          # Route protection
                                                    ```

                                                    ## API Endpoints

                                                    | Method | Endpoint | Description |
                                                    |--------|----------|-------------|
                                                    | POST | `/api/auth/register` | Register new user |
                                                    | POST | `/api/auth/login` | User login |
                                                    | GET | `/api/agents` | List user agents |
                                                    | POST | `/api/agents` | Create new agent |
                                                    | GET | `/api/agents/:id` | Get agent details |
                                                    | PUT | `/api/agents/:id` | Update agent |
                                                    | DELETE | `/api/agents/:id` | Delete agent |
                                                    | POST | `/api/agents/:id/chat` | Chat with agent |
                                                    | GET | `/api/user/profile` | Get user profile |
                                                    | PUT | `/api/user/profile` | Update profile |
                                                    | PUT | `/api/user/password` | Change password |
                                                    | GET | `/api/user/api-keys` | List API keys |
                                                    | POST | `/api/user/api-keys` | Create API key |

                                                    ## License

                                                    MIT
