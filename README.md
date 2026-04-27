**DATABASE

MariaDB [SIMS]> show tables;
+----------------+
| Tables_in_sims |
+----------------+
| spareparts     |
| stockin        |
| stockout       |
| users          |
+----------------+

MariaDB [SIMS]> desc stockin;
+-------------+---------+------+-----+---------+----------------+
| Field       | Type    | Null | Key | Default | Extra          |
+-------------+---------+------+-----+---------+----------------+
| StockInId   | int(11) | NO   | PRI | NULL    | auto_increment |
| SparePartId | int(11) | YES  | MUL | NULL    |                |
| Quantity    | int(11) | NO   |     | NULL    |                |
| UnitPrice   | int(11) | NO   |     | NULL    |                |
| TotalPrice  | int(11) | YES  |     | NULL    |                |
| StockInDate | date    | NO   |     | NULL    |                |
+-------------+---------+------+-----+---------+----------------+
6 rows in set (0.005 sec)

MariaDB [SIMS]> desc stockout;
+--------------+---------+------+-----+---------+----------------+
| Field        | Type    | Null | Key | Default | Extra          |
+--------------+---------+------+-----+---------+----------------+
| StockOutId   | int(11) | NO   | PRI | NULL    | auto_increment |
| SparePartId  | int(11) | YES  | MUL | NULL    |                |
| Quantity     | int(11) | NO   |     | NULL    |                |
| UnitPrice    | int(11) | NO   |     | NULL    |                |
| TotalPrice   | int(11) | YES  |     | NULL    |                |
| StockOutDate | date    | NO   |     | NULL    |                |
+--------------+---------+------+-----+---------+----------------+
6 rows in set (0.006 sec)

MariaDB [SIMS]> desc users;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| UserId   | int(11)      | NO   | PRI | NULL    | auto_increment |
| UserName | varchar(100) | NO   |     | NULL    |                |
| Email    | varchar(100) | NO   | UNI | NULL    |                |
| Password | varchar(100) | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
4 rows in set (0.005 sec)
