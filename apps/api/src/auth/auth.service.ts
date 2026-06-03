import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import type { DataScope, DesignTwinRole } from "@designtwin/shared";
import { DEMO_USERS } from "./demo-users";

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: DesignTwinRole;
  dataScope: DataScope;
  branchId: string;
  departmentId: string;
};

export type LoginSession = {
  accessToken: string;
  user: AuthenticatedUser;
};

@Injectable()
export class AuthService {
  private readonly jwt: JwtService;

  constructor() {
    const secret = process.env.JWT_SECRET || "designtwin-local-dev-secret";
    this.jwt = new JwtService({ secret, signOptions: { expiresIn: "8h" } });
  }

  async login(input: LoginInput): Promise<LoginSession> {
    const user = DEMO_USERS.find((candidate) => candidate.email === input.email);
    if (!user || user.password !== input.password) {
      throw new Error("Invalid credentials");
    }

    const safeUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      dataScope: user.dataScope,
      branchId: user.branchId,
      departmentId: user.departmentId,
    };

    const accessToken = await this.jwt.signAsync({
      sub: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      dataScope: safeUser.dataScope,
      branchId: safeUser.branchId,
      departmentId: safeUser.departmentId,
    });

    return { accessToken, user: safeUser };
  }
}
