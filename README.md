# 🏥 Metabolic Hub - Plataforma de Gestão de Saúde

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3.1-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Descrição do Projeto

**Metabolic Hub** é uma plataforma web moderna e completa para gestão de saúde, desenvolvida como projeto de monografia. O sistema permite que médicos e pacientes gerenciem exames laboratoriais, antropometria e relacionamentos médico-paciente de forma segura e eficiente.

### ✨ Principais Funcionalidades

- 🔐 **Sistema de Autenticação Completo**
  - Login com credenciais ou OAuth (Google, GitHub)
  - Autenticação de dois fatores (2FA)
  - Verificação de email
  - Recuperação de senha
  - Controle de acesso baseado em roles

- 👥 **Gestão de Usuários**
  - Perfis de usuário com informações pessoais
  - Sistema de roles (ADMIN, USER, MEDIC)
  - Upload e gerenciamento de imagens de perfil

- 🧪 **Gestão de Exames**
  - Cadastro de exames laboratoriais
  - Definição de valores de referência (normal, intermediário, crítico)
  - Histórico de resultados com gráficos interativos
  - Análise temporal de valores
  - Categorização por grupos de exames

- 📏 **Antropometria**
  - Registro de medidas corporais
  - Acompanhamento de evolução física
  - Histórico de medições com datas

- 👨‍⚕️ **Relacionamento Médico-Paciente**
  - Vinculação de médicos a pacientes
  - Consulta de CRM via API externa
  - Gestão de relacionamentos terapêuticos

- 📊 **Dashboard e Visualizações**
  - Gráficos interativos com Chart.js
  - Tabelas organizadas de dados
  - Filtros e busca avançada
  - Interface responsiva para todos os dispositivos

## 🏗️ Arquitetura e Tecnologias

### **Frontend**
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### **Backend**
- **Next.js API Routes** - API REST integrada
- **Prisma ORM** - Gerenciamento de banco de dados
- **NextAuth.js** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas

### **Banco de Dados**
- **PostgreSQL** - Banco de dados relacional
- **Prisma Schema** - Modelagem de dados

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Turbopack** - Bundler rápido para desenvolvimento

## 🗄️ Estrutura do Banco de Dados

### **Modelos Principais**

#### **User**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  gender        String?
  dateBirth     String?
  role          UserRole  @default(USER)
  isTwoFactorEnabled Boolean @default(false)
  
  // Relacionamentos
  accounts      Account[]
  exam_data     Exam_data[]
  anthropometry Anthropometry[]
  medicalPatients Patient[] @relation("MedicalUserRelation")
  patientProfiles Patient[] @relation("PatientUserRelation")
}
```

#### **Exam**
```prisma
model Exam {
  id                String    @id @default(cuid())
  name              String
  group             String
  normal_min        Float?
  normal_max        Float?
  intermediary_min  Float?
  intermediary_max  Float?
  hard_value        Float?
  unit              String
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  exam_data         Exam_data[]
}
```

#### **Exam_data**
```prisma
model Exam_data {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  show      Boolean
  examId    String
  userId    String
  value     Float?
  notes     String?
  lab       String?
  dateExam  String?
  
  exam      Exam     @relation("ExamToExamData", fields: [examId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### **Anthropometry**
```prisma
model Anthropometry {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  show       Boolean
  userId     String
  height     Float?
  weight     Float?
  chest      Float?
  shoulder   Float?
  rightArm   Float?
  leftArm    Float?
  waist      Float?
  rightLeg   Float?
  leftLeg    Float?
  rightCalf  Float?
  leftCalf   Float?
  notes      String?
  dateExam   String?
  
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### **Patient**
```prisma
model Patient {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  medicalId   String
  patientId   String
  
  medicalUser User @relation("MedicalUserRelation", fields: [medicalId], references: [id], onDelete: Cascade)
  patientUser User @relation("PatientUserRelation", fields: [patientId], references: [id], onDelete: Cascade)
}
```

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### **1. Clone o Repositório**
```bash
git clone <url-do-repositorio>
cd projeto-monografia
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Configure as Variáveis de Ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/metabolic_hub"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (opcional)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
GITHUB_CLIENT_ID="seu-github-client-id"
GITHUB_CLIENT_SECRET="seu-github-client-secret"

# Email (opcional)
RESEND_API_KEY="sua-resend-api-key"
```

### **4. Configure o Banco de Dados**
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma migrate dev

# (Opcional) Popule o banco com dados de exemplo
npm run seed
```

### **5. Execute o Projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
projeto-monografia/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── (protected)/        # Rotas protegidas
│   │   ├── api/                # API Routes
│   │   └── auth/               # Páginas de autenticação
│   ├── components/             # Componentes React
│   │   ├── auth/               # Componentes de autenticação
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   ├── main/               # Componentes principais
│   │   └── medical/            # Componentes médicos
│   ├── actions/                # Server Actions
│   ├── lib/                    # Utilitários e configurações
│   ├── data/                   # Acesso a dados
│   ├── hooks/                  # Custom Hooks
│   ├── schemas/                # Schemas de validação (Zod)
│   └── templates/              # Templates de páginas
├── prisma/                     # Schema e migrações do banco
├── public/                     # Arquivos estáticos
└── docs/                       # Documentação adicional
```

## 🔐 Sistema de Autenticação

### **Fluxo de Autenticação**
1. **Registro**: Usuário cria conta com email e senha
2. **Verificação**: Email é enviado para confirmação
3. **Login**: Autenticação com credenciais ou OAuth
4. **2FA**: Autenticação de dois fatores (opcional)
5. **Sessão**: JWT token para manter usuário logado

### **Controle de Acesso**
- **ADMIN**: Acesso total ao sistema
- **MEDIC**: Acesso a pacientes e exames
- **USER**: Acesso aos próprios dados

## 📊 Funcionalidades dos Exames

### **Tipos de Exames**
- **Exames Laboratoriais**: Hemograma, glicemia, colesterol, etc.
- **Antropometria**: Medidas corporais e composição física

### **Valores de Referência**
- **Normal**: Valores dentro do padrão saudável
- **Intermediário**: Valores que requerem atenção
- **Crítico**: Valores que requerem intervenção médica

### **Visualizações**
- **Gráficos de Linha**: Evolução temporal dos valores
- **Tabelas**: Dados organizados e filtrados
- **Comparativos**: Valores atuais vs. referência

## 🧪 API Externa

### **Consulta CRM**
- Integração com API do Conselho Federal de Medicina
- Validação de registros médicos
- Busca por CRM e UF

## 🎨 Interface e UX

### **Design System**
- **Tailwind CSS**: Classes utilitárias para estilização
- **Radix UI**: Componentes acessíveis e customizáveis
- **Lucide React**: Ícones consistentes e modernos

### **Responsividade**
- Design mobile-first
- Breakpoints para tablets e desktops
- Componentes adaptáveis

### **Acessibilidade**
- Navegação por teclado
- Screen readers
- ARIA labels
- Contraste adequado

## 🚨 Problemas Conhecidos e Melhorias

### **Issues de Linting**
- Variáveis não utilizadas
- Uso de tipos `any`
- Elementos `<img>` não otimizados

### **Melhorias Sugeridas**
- Substituir `<img>` por `<Image>` do Next.js
- Implementar lazy loading
- Otimizar bundle size
- Melhorar tratamento de erros

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas de linting automaticamente

# Banco de Dados
npx prisma studio    # Abre interface visual do Prisma
npx prisma migrate   # Gerencia migrações
npx prisma generate  # Gera cliente Prisma
```

## 🔧 Configurações

### **ESLint**
Configuração baseada no Next.js com regras TypeScript

### **TypeScript**
- Strict mode habilitado
- Path mapping para imports
- Configuração otimizada para Next.js

### **Tailwind CSS**
- Sistema de cores customizado
- Animações e transições
- Componentes responsivos

## 📚 Dependências Principais

### **Core**
- **Next.js 15**: Framework React com App Router
- **React 18**: Biblioteca de interface
- **TypeScript 5**: Superset JavaScript tipado

### **UI e Componentes**
- **Tailwind CSS**: Framework CSS utilitário
- **Radix UI**: Componentes primitivos acessíveis
- **Lucide React**: Biblioteca de ícones

### **Formulários e Validação**
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **@hookform/resolvers**: Integração entre React Hook Form e Zod

### **Autenticação**
- **NextAuth.js**: Sistema de autenticação completo
- **bcrypt**: Criptografia de senhas

### **Banco de Dados**
- **Prisma**: ORM moderno para TypeScript
- **PostgreSQL**: Banco de dados relacional

### **Gráficos e Visualizações**
- **Chart.js**: Biblioteca de gráficos
- **react-chartjs-2**: Wrapper React para Chart.js
- **Recharts**: Biblioteca alternativa de gráficos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Metabolic Hub** - Projeto de Monografia

## 🙏 Agradecimentos

- Next.js Team
- Prisma Team
- Tailwind CSS Team
- Comunidade open source

---

**⚠️ Nota**: Este é um projeto acadêmico desenvolvido como monografia. Para uso em produção, recomenda-se revisão de segurança e testes adicionais.
