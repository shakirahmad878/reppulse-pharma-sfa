import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sefmed_super_secure_jwt_token_pharma_2026_x89a';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

// Demo accounts database
const DEMO_USERS = [
  {
    id: 'usr-admin-01',
    email: 'admin@sefmed.com',
    password: 'password123',
    name: 'Rajesh Sharma',
    role: 'SUPER_ADMIN',
    employeeCode: 'EMP-HQ-001',
    territory: 'National Headquarter'
  },
  {
    id: 'usr-asm-01',
    email: 'asm.mumbai@sefmed.com',
    password: 'password123',
    name: 'Sunil Gavaskar',
    role: 'AREA_MANAGER',
    employeeCode: 'EMP-ASM-042',
    territory: 'West Zone - Mumbai'
  },
  {
    id: 'usr-mr-01',
    email: 'vikram.mr@sefmed.com',
    password: 'password123',
    name: 'Vikram Mehta',
    role: 'MEDICAL_REP',
    employeeCode: 'EMP-MUM-104',
    territory: 'Mumbai South & Bandra'
  }
];

router.post('/login', (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid email or password format' });
  }

  const { email, password } = parsed.data;
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials. Use admin@sefmed.com or vikram.mr@sefmed.com with password: password123' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeCode: user.employeeCode,
      territory: user.territory
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeCode: user.employeeCode,
      territory: user.territory
    }
  });
});

export default router;\n