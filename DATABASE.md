# 🗄️ Documentação do Banco de Dados - Metabolic Hub

## 📋 Visão Geral

O **Metabolic Hub** utiliza **PostgreSQL** como banco de dados principal, com **Prisma ORM** para gerenciamento de dados. O sistema foi projetado para gerenciar informações de saúde, exames laboratoriais, antropometria e relacionamentos médico-paciente.

## 🏗️ Arquitetura do Banco

### **Tecnologias**
- **PostgreSQL**: Banco de dados relacional robusto
- **Prisma ORM**: ORM moderno para TypeScript/Node.js
- **Prisma Migrate**: Sistema de migrações automático
- **Prisma Studio**: Interface visual para gerenciamento

### **Características**
- **ACID Compliance**: Transações seguras e consistentes
- **Relacionamentos**: Modelos bem definidos com foreign keys
- **Índices**: Otimização para consultas frequentes
- **Constraints**: Validações de integridade referencial

## 📊 Modelos de Dados

### **1. User (Usuário)**

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

**Campos:**
- `id`: Identificador único (CUID)
- `name`: Nome completo do usuário
- `email`: Email único para login
- `emailVerified`: Data de verificação do email
- `image`: URL da imagem de perfil
- `password`: Hash da senha (bcrypt)
- `gender`: Gênero do usuário
- `dateBirth`: Data de nascimento
- `role`: Tipo de usuário (ADMIN, USER, MEDIC)
- `isTwoFactorEnabled`: Habilita autenticação 2FA

**Relacionamentos:**
- `accounts`: Contas OAuth vinculadas
- `exam_data`: Exames realizados pelo usuário
- `anthropometry`: Medidas antropométricas
- `medicalPatients`: Pacientes vinculados (se médico)
- `patientProfiles`: Perfil de paciente (se paciente)

### **2. Exam (Exame)**

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

**Campos:**
- `id`: Identificador único
- `name`: Nome do exame (ex: "Glicemia", "Hemoglobina")
- `group`: Grupo/categoria do exame
- `normal_min/max`: Valores de referência normais
- `intermediary_min/max`: Valores que requerem atenção
- `hard_value`: Valor crítico que requer intervenção
- `unit`: Unidade de medida (mg/dL, g/dL, etc.)
- `createdAt/updatedAt`: Timestamps de criação/atualização

### **3. Exam_data (Dados do Exame)**

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

**Campos:**
- `id`: Identificador único
- `createdAt`: Data de criação do registro
- `show`: Se o resultado deve ser exibido
- `examId`: Referência ao exame
- `userId`: Referência ao usuário
- `value`: Valor numérico do resultado
- `notes`: Observações adicionais
- `lab`: Laboratório onde foi realizado
- `dateExam`: Data da realização do exame

### **4. Anthropometry (Antropometria)**

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

**Campos:**
- `id`: Identificador único
- `createdAt`: Data de criação
- `show`: Se deve ser exibido
- `userId`: Referência ao usuário
- `height`: Altura (cm)
- `weight`: Peso (kg)
- `chest`: Circunferência torácica (cm)
- `shoulder`: Largura dos ombros (cm)
- `rightArm/leftArm`: Circunferência dos braços (cm)
- `waist`: Circunferência da cintura (cm)
- `rightLeg/leftLeg`: Circunferência das coxas (cm)
- `rightCalf/leftCalf`: Circunferência das panturrilhas (cm)
- `notes`: Observações
- `dateExam`: Data da medição

### **5. Patient (Relacionamento Médico-Paciente)**

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

**Campos:**
- `id`: Identificador único
- `createdAt`: Data de criação do relacionamento
- `medicalId`: ID do usuário médico
- `patientId`: ID do usuário paciente

### **6. Medico (Informações Médicas)**

```prisma
model Medico {
  id            String      @id @default(cuid())
  nome          String
  email         String?     @unique
  crm           String
  tipo          TipoInscricao?
  situacao      Situacao?
  especialidade String?
  area          String?
  uf            String
  criadoEm      DateTime    @default(now())
  atualizadoEm  DateTime    @updatedAt

  @@unique([crm, uf])
}
```

**Campos:**
- `id`: Identificador único
- `nome`: Nome completo do médico
- `email`: Email de contato
- `crm`: Número do CRM
- `tipo`: Tipo de inscrição (Principal/Secundária)
- `situacao`: Situação do registro (Ativo/Inativo)
- `especialidade`: Especialidade médica
- `area`: Área de atuação
- `uf`: Estado de registro
- `criadoEm/atualizadoEm`: Timestamps

**Constraints:**
- `@@unique([crm, uf])`: CRM + UF deve ser único

### **7. Modelos de Autenticação**

#### **Account (Contas OAuth)**
```prisma
model Account {
  id                 String  @id @default(cuid())
  userId             String  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
 
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

#### **VerificationToken (Verificação de Email)**
```prisma
model VerificationToken {
  id String @id @default(cuid())
  email String
  token String @unique
  expires DateTime

  @@unique([email, token])
}
```

#### **PasswordResetToken (Reset de Senha)**
```prisma
model PasswordResetToken {
  id String @id @default(cuid())
  email String
  token String @unique
  expires DateTime
  @@unique([email,token])
}
```

#### **TwoFactorToken (Autenticação 2FA)**
```prisma
model TwoFactorToken {
  id String @id @default(cuid())
  email String
  token String @unique
  expires DateTime
  @@unique([email,token])
}
```

#### **TwoFactorConfirmation (Confirmação 2FA)**
```prisma
model TwoFactorConfirmation {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId])
}
```

## 🔗 Relacionamentos

### **Diagrama de Relacionamentos**

```
User (1) ←→ (N) Account
User (1) ←→ (N) Exam_data
User (1) ←→ (N) Anthropometry
User (1) ←→ (N) Patient (como médico)
User (1) ←→ (N) Patient (como paciente)

Exam (1) ←→ (N) Exam_data
```

### **Cascade Deletes**
- Ao deletar um `User`, todos os registros relacionados são removidos
- Ao deletar um `Exam`, todos os `Exam_data` são removidos
- Relacionamentos `Patient` são removidos quando usuários são deletados

## 📈 Índices e Performance

### **Índices Automáticos**
- `id`: Chave primária (automático)
- `email`: Unique constraint (automático)
- `[crm, uf]`: Composite unique (automático)

### **Índices Recomendados**
```sql
-- Para consultas frequentes por usuário
CREATE INDEX idx_exam_data_user_id ON exam_data(user_id);
CREATE INDEX idx_exam_data_exam_id ON exam_data(exam_id);
CREATE INDEX idx_anthropometry_user_id ON anthropometry(user_id);

-- Para consultas por data
CREATE INDEX idx_exam_data_date_exam ON exam_data(date_exam);
CREATE INDEX idx_anthropometry_date_exam ON anthropometry(date_exam);

-- Para consultas de autenticação
CREATE INDEX idx_verification_token_email ON verification_token(email);
CREATE INDEX idx_password_reset_token_email ON password_reset_token(email);
```

## 🚀 Migrações

### **Comandos de Migração**
```bash
# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Resetar banco (desenvolvimento)
npx prisma migrate reset

# Verificar status das migrações
npx prisma migrate status
```

### **Histórico de Migrações**
- `20250702220924_rename_fields`: Renomeação de campos existentes

## 🔒 Segurança

### **Proteções Implementadas**
- **Cascade Deletes**: Evita dados órfãos
- **Foreign Key Constraints**: Integridade referencial
- **Unique Constraints**: Evita duplicatas
- **Soft Deletes**: Campo `show` para exclusão lógica

### **Recomendações de Segurança**
- Usar conexões SSL para PostgreSQL
- Implementar rate limiting nas APIs
- Validar inputs com Zod schemas
- Usar prepared statements (Prisma faz automaticamente)

## 📊 Backup e Recuperação

### **Estratégias de Backup**
```bash
# Backup completo
pg_dump -h localhost -U usuario -d metabolic_hub > backup.sql

# Backup apenas schema
pg_dump -h localhost -U usuario -d metabolic_hub --schema-only > schema.sql

# Backup apenas dados
pg_dump -h localhost -U usuario -d metabolic_hub --data-only > data.sql
```

### **Recuperação**
```bash
# Restaurar backup completo
psql -h localhost -U usuario -d metabolic_hub < backup.sql

# Restaurar apenas schema
psql -h localhost -U usuario -d metabolic_hub < schema.sql
```

## 🧪 Dados de Teste

### **Scripts de Seed**
- `scripts/seed-exams.ts`: Cria exames padrão
- `scripts/seed-exam-data.ts`: Cria dados de exemplo

### **Executar Seeds**
```bash
# Executar todos os seeds
npm run seed

# Executar seed específico
npx tsx scripts/seed-exams.ts
npx tsx scripts/seed-exam-data.ts
```

## 🔍 Monitoramento

### **Prisma Studio**
```bash
# Abrir interface visual
npx prisma studio
```

### **Logs de Query**
```typescript
// Habilitar logs no Prisma Client
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

## 📚 Recursos Adicionais

### **Documentação Prisma**
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### **PostgreSQL**
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

---

**⚠️ Nota**: Este documento descreve a estrutura atual do banco de dados. Para modificações, sempre use as migrações do Prisma para manter a integridade dos dados.
