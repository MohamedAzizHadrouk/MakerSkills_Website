import * as bcrypt from 'bcrypt';

const hash = '$2b$12$9RAprs0cwkkHNHieUGI3D.kRKQrdCZ3N3/IKObFJ924044Zs.bVH2';

const passwords = ['admin123', 'user123', 'demo123'];

async function testPasswords() {
  console.log('🔍 Test des mots de passe...\n');
  
  for (const password of passwords) {
    const match = await bcrypt.compare(password, hash);
    if (match) {
      console.log(`✅ MOT DE PASSE TROUVÉ: "${password}"`);
      return;
    } else {
      console.log(`❌ "${password}" ne correspond pas`);
    }
  }
  
  console.log('\n⚠️ Aucun mot de passe du seeder ne correspond à ce hash.');
}

testPasswords().catch(console.error);

