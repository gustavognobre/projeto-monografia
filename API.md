# 🔌 Documentação da API - Metabolic Hub

## 📋 Visão Geral

O **Metabolic Hub** utiliza **Next.js API Routes** para fornecer endpoints RESTful. A API é integrada com o sistema de autenticação NextAuth.js e utiliza Prisma ORM para operações de banco de dados.

## 🏗️ Arquitetura da API

### **Tecnologias**
- **Next.js API Routes**: Endpoints REST integrados
- **NextAuth.js**: Autenticação e autorização
- **Prisma ORM**: Acesso ao banco de dados
- **Zod**: Validação de schemas
- **Server Actions**: Operações do lado do servidor

### **Estrutura**
```
src/app/api/
├── admin/           # Endpoints administrativos
├── auth/            # Autenticação NextAuth
└── consulta-crm/    # Consulta de CRM médico
```

## 🔐 Autenticação e Autorização

### **Middleware de Autenticação**
```typescript
// src/middleware.ts
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Lógica de roteamento baseada em autenticação
  // ...
});
```

### **Controle de Acesso por Role**
```typescript
// Verificação de role em componentes
import { RoleGate } from "@/components/auth/RoleGate";

<RoleGate allowedRole={UserRole.ADMIN}>
  <AdminPanel />
</RoleGate>
```

## 📡 Endpoints da API

### **1. Autenticação (NextAuth)**

#### **POST /api/auth/signin**
- **Descrição**: Endpoint de login
- **Método**: POST
- **Autenticação**: Não requerida
- **Body**: `{ email: string, password: string }`
- **Resposta**: Redirecionamento ou erro

#### **POST /api/auth/signout**
- **Descrição**: Endpoint de logout
- **Método**: POST
- **Autenticação**: Requerida
- **Resposta**: Redirecionamento para página inicial

#### **GET /api/auth/session**
- **Descrição**: Obtém sessão atual do usuário
- **Método**: GET
- **Autenticação**: Requerida
- **Resposta**: Dados da sessão ou null

### **2. Administração**

#### **GET /api/admin**
```typescript
// src/app/api/admin/route.ts
export async function GET() {
  const role = await currentRole();
  
  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }
  
  return new NextResponse(null, { status: 403 });
}
```

- **Descrição**: Verifica se usuário tem acesso administrativo
- **Método**: GET
- **Autenticação**: Requerida
- **Role**: ADMIN
- **Resposta**: 200 (autorizado) ou 403 (não autorizado)

### **3. Consulta CRM**

#### **GET /api/consulta-crm**
```typescript
// src/app/api/consulta-crm/route.ts
export async function GET(req: NextRequest) {
  const uf = req.nextUrl.searchParams.get("uf");
  const crm = req.nextUrl.searchParams.get("crm");

  if (!uf || !crm) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://portal.cfm.org.br/api/medicos/crm/${uf}/${crm}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro na requisição externa" }, { status: 500 });
  }
}
```

- **Descrição**: Consulta dados de médico via API externa do CFM
- **Método**: GET
- **Autenticação**: Requerida
- **Parâmetros**: `uf` (estado) e `crm` (número do CRM)
- **Resposta**: Dados do médico ou erro

**Exemplo de Uso:**
```bash
GET /api/consulta-crm?uf=SP&crm=12345
```

**Resposta de Sucesso:**
```json
{
  "medico": {
    "nome": "Dr. João Silva",
    "crm": "12345",
    "uf": "SP",
    "email": "joao.silva@email.com",
    "especialidade": "Clínico Geral"
  }
}
```

**Resposta de Erro:**
```json
{
  "error": "Médico não encontrado"
}
```

## 🚀 Server Actions

### **Autenticação**

#### **login**
```typescript
// src/actions/login.ts
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return { error: "Algum Problema com e-mail ou senha!" };
  }
  
  // Lógica de autenticação...
};
```

- **Descrição**: Autentica usuário com credenciais
- **Parâmetros**: `{ email, password, code? }`
- **Retorno**: `{ success?, error?, twoFactor? }`

#### **register**
```typescript
// src/actions/register.ts
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validação e criação de usuário
};
```

- **Descrição**: Registra novo usuário
- **Parâmetros**: Dados do formulário de registro
- **Retorno**: `{ success?, error? }`

#### **logout**
```typescript
// src/actions/logout.ts
export const logout = async () => {
  await signOut();
};
```

- **Descrição**: Realiza logout do usuário
- **Retorno**: Redirecionamento

### **Gestão de Usuários**

#### **settings**
```typescript
// src/actions/settings.ts
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // Atualização de configurações do usuário
};
```

- **Descrição**: Atualiza configurações do usuário
- **Parâmetros**: Dados de configuração
- **Retorno**: `{ success?, error? }`

### **Gestão de Exames**

#### **exams**
```typescript
// src/actions/exams.ts
export const createExam = async (values: z.infer<typeof ExamSchema>) => {
  // Criação de novo exame
};

export const updateExam = async (id: string, values: ExamUpdateSchema) => {
  // Atualização de exame existente
};

export const deleteExam = async (id: string) => {
  // Exclusão de exame
};
```

#### **exam_data**
```typescript
// src/actions/exam_data.ts
export const createExamData = async (values: ExamDataSchema) => {
  // Criação de resultado de exame
};

export const updateExamData = async (id: string, values: ExamDataUpdateSchema) => {
  // Atualização de resultado de exame
};

export const deleteExamData = async (id: string) => {
  // Exclusão de resultado de exame
};
```

### **Gestão de Antropometria**

#### **anthropometry**
```typescript
// src/actions/anthropometry.ts
export const createAnthropometry = async (values: AnthropometrySchema) => {
  // Criação de medição antropométrica
};
```

### **Gestão de Relacionamentos**

#### **patient_relation**
```typescript
// src/actions/patient_relation.ts
export const createPatient = async (medicalId: string, patientId: string) => {
  // Criação de relacionamento médico-paciente
};

export const getMyPatients = async (medicalId: string) => {
  // Lista pacientes de um médico
};

export const getMyDoctors = async (patientId: string) => {
  // Lista médicos de um paciente
};
```

## 📊 Schemas de Validação

### **Login**
```typescript
// src/schemas/index.ts
export const LoginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido!" }),
  password: z.string().min(8, { message: "Senha inválida!" }),
  code: z.optional(z.string()),
});
```

### **Registro**
```typescript
export const RegisterSchema = z.object({
  email: z.string().email({ message: "E-mail inválido!" }),
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  dateBirth: z.string({ required_error: "A data de nascimento é obrigatória." }),
  gender: z.enum(["Masculino", "Feminino", "Outros"]),
  image: z.string().optional(),
  password: z.string().min(8, { message: "Senha inválida!" }),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem.",
  path: ["confirmPassword"],
});
```

### **Configurações**
```typescript
export const SettingsSchema = z.object({
  name: z.string().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
}).refine((data) => {
  if (data.password && !data.newPassword) return false;
  return true;
}, {
  message: "Necessário preencher uma nova senha!",
  path: ["newPassword"],
});
```

## 🔒 Segurança

### **Validação de Input**
- Todos os inputs são validados com Zod schemas
- Sanitização automática de dados
- Prevenção de SQL injection via Prisma

### **Autenticação**
- JWT tokens seguros
- Refresh tokens automáticos
- Sessões com expiração

### **Autorização**
- Controle de acesso baseado em roles
- Middleware de proteção de rotas
- Verificação de permissões em cada endpoint

### **Rate Limiting**
- Proteção contra ataques de força bruta
- Limitação de tentativas de login
- Proteção de endpoints sensíveis

## 📝 Códigos de Status HTTP

### **Sucesso**
- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso

### **Redirecionamento**
- `302 Found`: Redirecionamento temporário
- `307 Temporary Redirect`: Redirecionamento temporário

### **Erro do Cliente**
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Não autorizado
- `404 Not Found`: Recurso não encontrado
- `422 Unprocessable Entity`: Validação falhou

### **Erro do Servidor**
- `500 Internal Server Error`: Erro interno
- `502 Bad Gateway`: Erro de gateway
- `503 Service Unavailable`: Serviço indisponível

## 🧪 Testes da API

### **Testando com cURL**

#### **Login**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### **Consulta CRM**
```bash
curl -X GET "http://localhost:3000/api/consulta-crm?uf=SP&crm=12345" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Testando com Postman**
1. Importe a coleção de endpoints
2. Configure as variáveis de ambiente
3. Execute as requisições de teste

## 📊 Monitoramento e Logs

### **Logs de API**
```typescript
// Habilitar logs detalhados
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### **Métricas Recomendadas**
- Taxa de sucesso das requisições
- Tempo de resposta médio
- Número de erros por endpoint
- Uso de recursos do servidor

## 🚨 Tratamento de Erros

### **Estrutura de Erro Padrão**
```typescript
interface ApiError {
  error: string;
  details?: string;
  code?: string;
  timestamp?: string;
}
```

### **Exemplo de Resposta de Erro**
```json
{
  "error": "Usuário não encontrado",
  "details": "O email fornecido não está cadastrado no sistema",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **Tratamento de Erros Comuns**
- Validação de dados
- Autenticação falhou
- Autorização insuficiente
- Recurso não encontrado
- Erro interno do servidor

## 🔄 Versionamento da API

### **Estratégia de Versionamento**
- **URL Path**: `/api/v1/endpoint`
- **Header**: `Accept: application/vnd.api+json;version=1`
- **Query Parameter**: `?version=1`

### **Compatibilidade**
- Manter compatibilidade com versões anteriores
- Documentar mudanças breaking
- Fornecer migração gradual

## 📚 Recursos Adicionais

### **Documentação Next.js**
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### **NextAuth.js**
- [Documentação Oficial](https://next-auth.js.org/)
- [API Reference](https://next-auth.js.org/reference)

### **Prisma**
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**⚠️ Nota**: Esta documentação descreve a API atual do projeto. Para modificações, sempre teste os endpoints e mantenha a compatibilidade com clientes existentes.
