<?php
// backend-php/controllers/SubscriptionsController.php

class SubscriptionsController {
    private static function getDb() {
        return Database::getConnection();
    }

    public static function getAll() {
        try {
            $db = self::getDb();
            $stmt = $db->query('
                SELECT us.id, us.user_id, us.plan_type, us.status, 
                       us.start_date, us.end_date, us.stripe_subscription_id
                FROM user_subscriptions us
                ORDER BY us.created_at DESC
            ');
            $subscriptions = $stmt->fetchAll();
            respondSuccess($subscriptions, 'Assinaturas retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getById($id) {
        try {
            $db = self::getDb();
            $stmt = $db->prepare('
                SELECT us.id, us.user_id, us.plan_type, us.status, 
                       us.start_date, us.end_date, us.stripe_subscription_id
                FROM user_subscriptions us
                WHERE us.id = ?
            ');
            $stmt->execute([$id]);
            $subscription = $stmt->fetch();

            if (!$subscription) {
                respondError('Assinatura não encontrada', 404);
            }

            respondSuccess($subscription, 'Assinatura retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getByUserId($userId) {
        try {
            $db = self::getDb();
            $stmt = $db->prepare('
                SELECT us.id, us.user_id, us.plan_type, us.status, 
                       us.start_date, us.end_date, us.stripe_subscription_id
                FROM user_subscriptions us
                WHERE us.user_id = ?
                ORDER BY us.created_at DESC
                LIMIT 1
            ');
            $stmt->execute([$userId]);
            $subscription = $stmt->fetch();

            respondSuccess($subscription ?: [], 'Assinatura do usuário retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getStats() {
        try {
            $db = self::getDb();
            
            $stmt = $db->query('
                SELECT 
                    plan_type,
                    status,
                    COUNT(*) as count
                FROM user_subscriptions
                GROUP BY plan_type, status
            ');
            
            $stats = $stmt->fetchAll();

            $total = $db->query('SELECT COUNT(*) as count FROM user_subscriptions')->fetch()['count'];
            $active = $db->query('SELECT COUNT(*) as count FROM user_subscriptions WHERE status = "active"')->fetch()['count'];

            respondSuccess([
                'total' => $total,
                'active' => $active,
                'byPlan' => $stats
            ], 'Estatísticas de assinaturas');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function create() {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $userId = $data['user_id'] ?? $user['user_id'];
            $planType = $data['plan_type'] ?? '';
            $status = $data['status'] ?? 'active';

            if (empty($planType)) {
                respondError('Plan type é obrigatório', 400);
            }

            $db = self::getDb();
            $stmt = $db->prepare('
                INSERT INTO user_subscriptions 
                (user_id, plan_type, status, start_date, end_date, stripe_subscription_id, created_at)
                VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), ?, NOW())
            ');

            $stripeId = $data['stripe_subscription_id'] ?? null;
            $stmt->execute([$userId, $planType, $status, $stripeId]);

            $id = $db->lastInsertId();
            respondSuccess(['id' => $id], 'Assinatura criada com sucesso', 201);
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function update($id) {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $db = self::getDb();

            $updateFields = [];
            $values = [];

            if (isset($data['status'])) {
                $updateFields[] = 'status = ?';
                $values[] = $data['status'];
            }

            if (isset($data['plan_type'])) {
                $updateFields[] = 'plan_type = ?';
                $values[] = $data['plan_type'];
            }

            if (empty($updateFields)) {
                respondError('Nenhum campo para atualizar', 400);
            }

            $values[] = $id;
            $sql = 'UPDATE user_subscriptions SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
            
            $stmt = $db->prepare($sql);
            $stmt->execute($values);

            if ($stmt->rowCount() === 0) {
                respondError('Assinatura não encontrada', 404);
            }

            respondSuccess([], 'Assinatura atualizada com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }
}

?>
