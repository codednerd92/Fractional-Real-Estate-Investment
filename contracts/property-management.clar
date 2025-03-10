;; Property Management Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

;; Define data maps
(define-map maintenance-expenses uint uint)
(define-map maintenance-decisions
  uint
  { description: (string-utf8 500), cost: uint, approved: bool }
)

;; Public functions
(define-public (propose-maintenance (property-id uint) (description (string-utf8 500)) (cost uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set maintenance-decisions property-id { description: description, cost: cost, approved: false })
    (ok true)
  )
)

(define-public (approve-maintenance (property-id uint))
  (let ((decision (unwrap! (map-get? maintenance-decisions property-id) err-not-found)))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set maintenance-decisions property-id (merge decision { approved: true }))
    (map-set maintenance-expenses property-id (+ (default-to u0 (map-get? maintenance-expenses property-id)) (get cost decision)))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-maintenance-decision (property-id uint))
  (map-get? maintenance-decisions property-id)
)

(define-read-only (get-total-expenses (property-id uint))
  (default-to u0 (map-get? maintenance-expenses property-id))
)

