from fastapi import APIRouter

router = APIRouter(tags=['monitoring'])


@router.get('/healthz')
async def healthz() -> dict:
    return {'status': 'ok'}
