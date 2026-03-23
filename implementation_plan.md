# Phase 7: Carousel Library Screen

This phase transforms the authenticated Dashboard and Library segments into functional work areas. We'll introduce the interface where users can view their created contents (`carousels` collection configured in Phase 2) and initialize new draft carousels instantly via a quick-create system.

## User Review Required
> [!IMPORTANT]
> The quick-create functionality creates a draft entry in the `carousels` database and subsequently routes the user to what will be the Canvas Editor (Phase 8). I will configure the interface to immediately route to `http://localhost:3000/editor/[id]`. Let me know if you would like me to adjust this routing path before I execute the frontend components.

## Proposed Changes

### Library Views
We will provide standard grids reflecting all projects mapped strictly to the user.
#### [NEW] `apps/web/app/(dashboard)/library/page.tsx`
A dedicated page explicitly fetching the `carousels` array mapped to the Next.js layout via [pocketbase.ts](file:///c:/Users/anil_/Downloads/Apps/Slidr2/apps/web/lib/pocketbase.ts) client rendering mechanisms. It will display a grid of all project thumbnails or status badges.
#### [NEW] `apps/web/components/carousels/CarouselCard.tsx`
A reusable Shadcn-based Card wrapper encapsulating title, updated timestamps, draft/completed status tags, and delete functionalities.

### Quick-Create System
We will add immediate action routines allowing users to spin up a new presentation.
#### [NEW] `apps/web/components/carousels/CreateCarouselDialog.tsx`
A Shadcn Dialog (Modal) prompting simply for a "Title". Upon submission, it leverages the `pb.collection('carousels').create(...)` endpoint to store a `status: "draft"` layout.
#### [MODIFY] [apps/web/app/(dashboard)/page.tsx](file:///c:/Users/anil_/Downloads/Apps/Slidr2/apps/web/app/%28dashboard%29/page.tsx)
Refactor the generic dashboard layout placeholder to include the `<CreateCarouselDialog />` prominently above explicitly fetching the 3 most recently modified `carousels` to render the user's active history correctly.

## Verification Plan

### Automated Tests
- N/A at this stage.

### Manual Verification
1. Access the Next.js client (`npm run dev`).
2. Log into the UI securely. The dashboard (`/dashboard`) will render a clear "Create Carousel" action button alongside an "Empty Recent Projects" state initially. 
3. Click "Create Carousel", fill out "Test Carousel 1", and hit submit.
4. Verify you get securely redirected towards `/editor/[new_id]` (which will currently 404 until Phase 8 is implemented).
5. Navigate back to `/library`. Validate the new "Test Carousel 1" explicitly renders in a Draft state accurately.
