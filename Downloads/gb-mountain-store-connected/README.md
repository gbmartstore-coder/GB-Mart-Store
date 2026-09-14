# GB Mountain Store — Admin Integrated

This build keeps the second storefront design and integrates the admin panel from the first project.

## Run
```bash
npm install
npm run dev
```

Open `/admin` or use the Admin Portal entry in the navigation.

## Firebase
The admin system uses the Firebase configuration included in this project. Configure Authentication and Firestore rules before production use.

Admin access is controlled by the email/role logic in `src/admin-system/AuthContext.tsx`.
