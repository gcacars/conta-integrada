import { getSecureClient } from '../database/client.ts';
import { useKeyAltName } from "../../server/utils/key-alt-name.ts";
import type { User } from '../../shared/types/user.ts';

async function load(): Promise<string | null> {
  const { db, createDek, client } = await getSecureClient();
  const coll = db.collection<User>('users');

  const record = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
  } as User;

  let adminUser = await coll.findOne({ email: record.email });

  if (!adminUser) {
    const result = await coll.insertOne(record);

    if (result.acknowledged) {
      console.log('Usuário admin registrado com sucesso!');
    }

    adminUser = await coll.findOne({ _id: result.insertedId });
  }

  // Criar DEK
  const keyAltName = useKeyAltName(adminUser?._id.toString() || '');
  const existingDek = await client.db('encryption').collection('keyVault')
    .findOne({ keyAltNames: keyAltName });

  if (!existingDek) await createDek([keyAltName]);

  console.log(`✅ Admin ${adminUser?.email} criado.`);

  return adminUser?._id.toString() || null;
}

export { load };
