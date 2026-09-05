# Firebase Security Specification

## 1. Data Invariants
- A listing must have a valid `ownerId` that matches the authenticated user creating it.
- A user can only write to their own profile at `/users/{userId}` where `userId` matches their UID.
- Public read access is permitted for all listings, as this is a public directory.
- Private user profiles or sensitive data are restricted.

## 2. Invalidation Testing Payloads (The "Dirty Dozen")
1. **Unauthenticated Listing Creation**: Post payload to `/listings/123` with no credentials. (Denied)
2. **Identity Theft (Listing)**: Create listing where `ownerId` is different from authenticated user's ID. (Denied)
3. **Ghost Fields Update**: Inject arbitrary `isVerified: true` into a listing. (Denied)
4. **Invalid Type Injection**: set `rating` to a string or ultra-long content. (Denied)
5. **Unauthorized Listing Deletion**: User deletes a listing they do not own. (Denied)
6. **Self-Promote to Admin**: Write to `/admins/` or `/roles/` to gain elevate permissions. (Denied)
7. **Write to other Profile**: Write to `/users/alice` from authenticated account `bob`. (Denied)
8. **Malicious ID Poisoning**: Create document under `/listings/...malicious-long-chars...`. (Denied)
9. **No-limit Array Exhaustion**: Push unbounded arrays into directory documents. (Denied)
10. **Spoofed Verification**: Update a profile fields using unverified email. (Denied)
11. **Negative Price Field**: Push invalid fields bypassing application limits. (Denied)
12. **Future Modified Time**: Push future timestamps bypassing request.time. (Denied)
