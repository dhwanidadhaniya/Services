from datetime import date, datetime
from typing import Optional

from fastapi import Query
from sqlalchemy.orm import Query as SAQuery

from app.models import Transaction


class TransactionFilters:
    def __init__(
        self,
        date_from: Optional[date] = Query(None),
        date_to: Optional[date] = Query(None),
        transaction_type: Optional[str] = Query(None),
        channel: Optional[str] = Query(None),
        region: Optional[str] = Query(None),
        status: Optional[str] = Query(None),
        exception: Optional[bool] = Query(None),
        manual_review: Optional[bool] = Query(None),
    ):
        self.date_from = date_from
        self.date_to = date_to
        self.transaction_type = transaction_type
        self.channel = channel
        self.region = region
        self.status = status
        self.exception = exception
        self.manual_review = manual_review


def apply_filters(query: SAQuery, filters: TransactionFilters) -> SAQuery:
    if filters.date_from:
        start = datetime.combine(filters.date_from, datetime.min.time())
        query = query.filter(Transaction.transaction_date >= start)
    if filters.date_to:
        end = datetime.combine(filters.date_to, datetime.max.time())
        query = query.filter(Transaction.transaction_date <= end)
    if filters.transaction_type:
        query = query.filter(Transaction.transaction_type == filters.transaction_type)
    if filters.channel:
        query = query.filter(Transaction.channel == filters.channel)
    if filters.region:
        query = query.filter(Transaction.region == filters.region)
    if filters.status:
        query = query.filter(Transaction.settlement_status == filters.status)
    if filters.exception is not None:
        query = query.filter(Transaction.exception_flag == filters.exception)
    if filters.manual_review is not None:
        query = query.filter(Transaction.manual_review == filters.manual_review)
    return query


def rate(numerator: int, denominator: int) -> float:
    if denominator == 0:
        return 0.0
    return round((numerator / denominator) * 100, 2)
