import imaplib
import email
import time
import pyodbc
from bs4 import BeautifulSoup
from pymongo import MongoClient


# ! def function
def Read_HTML_Context(html_content):
    # Tạo đối tượng BeautifulSoup từ nội dung HTML
    soup = BeautifulSoup(html_content, "html.parser")

    # Tìm tất cả các thẻ <p> chứa "Tài khoản Spend Account" hoặc "Mô tả"
    matching_paragraphs = soup.find_all("p", string=lambda text: text and ("Tài khoản Spend Account vừa tăng" in text or "Mô tả" in text))

    result = []

    # In ra nội dung các thẻ <p> tương ứng
    for paragraph in matching_paragraphs:
        if "Số dư hiện tại:" in paragraph.get_text():
            # Tách chuỗi thành hai chuỗi nhỏ
            str = paragraph.get_text().split("\nSố dư hiện tại:")[0]
            result.append(str.strip())
        else:
            result.append(paragraph.get_text())
    return result
# -------------------------------------------------------------------- #
def ConnectDB(time, detail, vnd):
    # Thiết lập kết nối tới MongoDB
    client = MongoClient('mongodb+srv://dotien_admin:loginto123@orchids-db.09jmkh4.mongodb.net/?retryWrites=true&w=majority')  # Thay thế bằng thông tin kết nối MongoDB của bạn

    # Chọn cơ sở dữ liệu và bảng/collection tương ứng
    db = client['orchids-1']
    collection = db['donation']

    # Tạo một document mới
    new_donation = {
        'time': time,
        'detail': detail,
        'vnd': vnd
    }

    # Chèn document vào collection
    result = collection.insert_one(new_donation)

    # In thông tin về document được chèn
    print('Inserted document ID:', result.inserted_id)

    # Đóng kết nối
    client.close()
# !

def getUpdate(imap):
    imap.select('INBOX')
    search_sender = 'support@timo.vn'
    search_query = f'(UNSEEN FROM "{search_sender}")'
    # search_query = f'(FROM "{search_sender}")'
    status, messages = imap.search(None, search_query)
    message_ids = messages[0].split()
    if len(message_ids) > 0:
        latest_email_id = message_ids[-1]
        _, msg_data = imap.fetch(latest_email_id, '(RFC822)')
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        if content_type == 'text/plain' or content_type == 'text/html':
                            content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                            return Read_HTML_Context(content)
                else:
                    content = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
                    return Read_HTML_Context(content)
    else:
        return('null')




# Thông tin máy chủ IMAP của Gmail
IMAP_SERVER = 'imap.gmail.com'
USERNAME = 'tiennt1242@gmail.com'
PASSWORD = 'odyuxcygnupoirgx'

imap = imaplib.IMAP4_SSL(IMAP_SERVER)

imap.login(USERNAME, PASSWORD)

while True:
    # Call getUpdate function
    transaction = getUpdate(imap)
    print(transaction)
    if transaction != "null" :
        if len(transaction) == 2:
            vnd = transaction[0].split('tăng ')[1].split(' ')[0].replace(".", "")
            Dtime = transaction[0].split('vào ')[1].replace(".", "")
            detail = transaction[1].split('Mô tả: ')[1]
            ConnectDB(Dtime, detail, vnd )
    # Wait for 5 seconds
    time.sleep(5)
    
# imap.logout()

# imap.login(USERNAME, PASSWORD)
# transaction = getUpdate(imap)
# imap.logout()

# print(transaction)

# if transaction != "null" :
#     if len(transaction) == 2:
#         vnd = transaction[0].split('tăng ')[1].split(' ')[0].replace(".", "")
#         time = transaction[0].split('vào ')[1].replace(".", "")
#         detail = transaction[1].split('Mô tả: ')[1]
#         ConnectDB(time, detail, vnd )