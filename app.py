# app.py (Flask Backend)

from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize Firebase Admin
cred = credentials.Certificate("reg-monitoring-b9378-firebase-adminsdk-unejj-2c613599e2.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Example category mapping
CATEGORY_SUBJECT_CODES = {
    "EU Institutions, Law, and Budget": {
        "EU Institutions & Decision-Making": [
            "8.40", "8.40.01", "8.40.01.03", "8.40.01.06", "8.40.01.08", "8.40.02",
            "8.40.03", "8.40.04", "8.40.09", "8.40.10", "8.40.11", "8.40.13", "8.40.14",
            "8.40.16", "8.50", "8.50.01", "8.50.02"
        ],
        "Budget of the Union & Financial Regulations": [
            "8.70", "8.70.01", "8.70.02", "8.70.03", "8.70.03.01", "8.70.03.02",
            "8.70.03.03", "8.70.03.04", "8.70.03.05", "8.70.03.06", "8.70.03.07",
            "8.70.03.08", "8.70.04", "8.70.40", "8.70.50", "8.70.55", "8.70.56",
            "8.70.57", "8.70.58", "8.70.59", "8.70.60", "8.70.70"
        ],
        "EU Law, Treaties, and Values": [
            "1.10", "1.20", "1.20.01", "1.20.02", "1.20.03", "1.20.04", "1.20.05",
            "1.20.09", "1.20.20", "8", "8.10", "8.30", "8.30.10", "8.60"
        ]
    },

    "Foreign Policy, Security & International Relations": {
        "Common Foreign & Security Policy, International Organisations": [
            "6", "6.10", "6.10.01", "6.10.02", "6.10.03", "6.10.04", "6.10.05",
            "6.10.08", "6.10.09", "6.40", "6.40.01", "6.40.02", "6.40.02.02",
            "6.40.03", "6.40.04", "6.40.04.02", "6.40.04.04", "6.40.05", "6.40.05.01",
            "6.40.05.02", "6.40.05.06", "6.40.06", "6.40.07", "6.40.08", "6.40.09",
            "6.40.10", "6.40.11", "6.40.12", "6.40.13", "6.40.14", "6.40.15", "6.40.16",
            "6.40.17"
        ],
        "Enlargement & Relations with Neighbour Countries": [
            "8.20", "8.20.01", "8.20.02", "8.20.03", "8.20.04", "8.20.06",
            "8.20.08", "8.20.12", "8.20.13", "8.20.16", "8.20.17", "8.20.18",
            "8.20.19", "8.20.20", "8.20.24", "8.20.26", "8.20.28", "8.20.32",
            "8.20.40"
        ]
    },

    "Economic & Monetary Affairs, Finance, and Banking": {
        "Economic & Monetary Policy, Financial Services": [
            "2", "2.10", "2.10.01", "2.10.02", "2.10.03", "2.20", "2.20.01",
            "2.30", "2.40", "2.40.01", "2.40.02", "2.50", "2.50.02", "2.50.03",
            "2.50.04", "2.50.04.02", "2.50.05", "2.50.08", "2.50.10", "2.60",
            "2.60.01", "2.60.02", "2.60.03", "2.60.04", "2.70", "2.70.01",
            "2.70.02", "5.05", "5.10", "5.10.01", "5.10.02", "5.20", "5.20.01",
            "5.20.02", "5.20.03"
        ],
        "Banks, Credit & Securities Markets": [
            "2.50.03", "2.50.04", "2.50.08", "2.50.10"
        ]
    },

    "Internal Market, Trade & Competition": {
        "Internal Market & Competition": [
            "2", "2.40", "2.60", "2.60.01", "2.60.02", "2.60.03", "2.60.04"
        ],
        "Trade Policies, Customs & Tariffs": [
            "2.10.01", "2.10.02", "2.40.02", "6.20.04", "6.20.03", "6.20.05"
        ]
    },

    "Agriculture, Fisheries & Rural Development": {
        "Agriculture": [
            "3.10", "3.10.01", "3.10.01.02", "3.10.02", "3.10.03", "3.10.04",
            "3.10.04.02", "3.10.05", "3.10.05.01", "3.10.05.02", "3.10.06",
            "3.10.06.01", "3.10.06.02", "3.10.06.03", "3.10.06.04", "3.10.06.05",
            "3.10.06.06", "3.10.06.07", "3.10.06.08", "3.10.06.09", "3.10.06.10",
            "3.10.07", "3.10.08", "3.10.08.01", "3.10.09", "3.10.09.02",
            "3.10.09.04", "3.10.09.06", "3.10.10", "3.10.11", "3.10.12", "3.10.13",
            "3.10.14", "3.10.14.04", "3.10.15", "3.10.30"
        ],
        "Fisheries": [
            "3.15", "3.15.01", "3.15.02", "3.15.03", "3.15.04", "3.15.05",
            "3.15.06", "3.15.07", "3.15.08", "3.15.15", "3.15.15.02", "3.15.15.03",
            "3.15.15.04", "3.15.15.06", "3.15.15.08", "3.15.16", "3.15.17"
        ]
    },

    "Environment, Climate & Natural Resources": {
        "Environment & Sustainability": [
            "3.70", "3.70.01", "3.70.02", "3.70.03", "3.70.04", "3.70.05",
            "3.70.07", "3.70.08", "3.70.09", "3.70.10", "3.70.11", "3.70.12",
            "3.70.13", "3.70.15", "3.70.16", "3.70.17", "3.70.18", "3.70.20"
        ],
        "Animal, Plant, and Health-related Environmental Aspects": [
            "3.10.08", "3.10.09.02", "3.10.09.04", "3.10.09.06"
        ]
    },

    "Transport & Infrastructure": {
        "Transport policy & modes": [
            "3.20", "3.20.01", "3.20.01.01", "3.20.02", "3.20.02.01", "3.20.03",
            "3.20.03.01", "3.20.04", "3.20.05", "3.20.06", "3.20.07", "3.20.08",
            "3.20.09", "3.20.10", "3.20.11", "3.20.15", "3.20.15.02",
            "3.20.15.04", "3.20.15.06", "3.20.15.08", "3.20.20"
        ]
    },

    "Social Policy, Employment & Equality": {
        "Social Policy & Employment": [
            "4", "4.10", "4.10.02", "4.10.03", "4.10.04", "4.10.04.01", "4.10.05",
            "4.10.06", "4.10.07", "4.10.08", "4.10.09", "4.10.10", "4.10.11",
            "4.10.12", "4.10.13", "4.10.14", "4.10.15", "4.10.16", "4.10.25",
            "4.15", "4.15.02", "4.15.03", "4.15.04", "4.15.05", "4.15.06",
            "4.15.08", "4.15.10", "4.15.12", "4.15.14", "4.15.15"
        ],
        "Equal Opportunities, Gender Equality, Rights": [
            "1.20.09", "4.10.04", "4.10.08", "5.20.02"
        ]
    },

    "Justice, Freedom & Security": {
        "Justice and Home Affairs": [
            "7", "7.10", "7.10.02", "7.10.04", "7.10.06", "7.10.08",
            "7.30", "7.30.02", "7.30.05", "7.30.05.01", "7.30.08", "7.30.09",
            "7.30.12", "7.30.20", "7.30.30", "7.30.30.02", "7.30.30.04", "7.30.30.06",
            "7.30.30.08", "7.30.30.10", "7.40", "7.40.02", "7.40.04", "7.90"
        ],
        "Migration, Asylum, Borders": [
            "7.10.04", "7.10.06"
        ]
    },

    "Health, Consumer Protection & Pharmaceutical Policy": {
        "Health & Consumer Protection": [
            "4.20", "4.20.01", "4.20.02", "4.20.02.04", "4.20.02.06", "4.20.03",
            "4.20.04", "4.20.05", "4.20.06", "4.20.07", "4.60", "4.60.02",
            "4.60.04", "4.60.04.02", "4.60.04.04", "4.60.06", "4.60.08"
        ],
        "Pharmaceutical and Medical": [
            "4.20.04", "3.10.10", "5.20.03"  # Add codes related to pharma if needed
        ]
    },

    "Education, Culture & Youth": {
        "Education, Vocational Training & Youth": [
            "4.30", "4.40", "4.40.01", "4.40.03", "4.40.06", "4.40.07", "4.40.08",
            "4.40.10", "4.40.15", "4.40.20", "8.40.01.06"
        ],
        "Culture, Arts & Heritage": [
            "4.45", "4.45.02", "4.45.06", "4.45.08", "4.45.10"
        ]
    },

    "Energy, Industry & Innovation": {
        "Energy Policy & Resources": [
            "3.60", "3.60.01", "3.60.02", "3.60.03", "3.60.04", "3.60.05",
            "3.60.06", "3.60.08", "3.60.10", "3.60.12", "3.60.15"
        ],
        "Industry, SMEs & Entrepreneurship": [
            "3.40", "3.40.01", "3.40.02", "3.40.03", "3.40.04", "3.40.05",
            "3.40.06", "3.40.07", "3.40.08", "3.40.09", "3.40.10", "3.40.11",
            "3.40.12", "3.40.13", "3.40.14", "3.40.16", "3.40.17", "3.40.18",
            "3.45", "3.45.01", "3.45.02", "3.45.03", "3.45.04", "3.45.05",
            "3.45.06", "3.45.07", "3.45.08", "5", "5.03"
        ],
        "Research, Innovation, ICT & Digital": [
            "3.30", "3.30.01", "3.30.01.02", "3.30.02", "3.30.03", "3.30.03.04",
            "3.30.03.06", "3.30.05", "3.30.06", "3.30.07", "3.30.08", "3.30.09",
            "3.30.15", "3.30.16", "3.30.20", "3.30.25", "3.30.25.02", "3.30.30",
            "3.50", "3.50.01", "3.50.01.05", "3.50.02", "3.50.02.01", "3.50.02.02",
            "3.50.02.03", "3.50.04", "3.50.06", "3.50.08", "3.50.15", "3.50.16",
            "3.50.20"
        ]
    },

    "Regional Policy & Cohesion": {
        "Regional and Cohesion Policy": [
            "4.70", "4.70.01", "4.70.02", "4.70.03", "4.70.04", "4.70.05",
            "4.70.06", "4.70.07"
        ]
    },

    "Taxation & Customs": {
        "Taxation, Customs & Duties": [
            "2.70", "2.70.02", "2.10.01", "2.10.02"
        ]
    },

    "Relief, Humanitarian Aid & Disaster Response": {
        "Emergency, Disaster & Humanitarian Aid": [
            "6.50", "3.70.10", "3.70.11"
        ]
    }
}



@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = list(CATEGORY_SUBJECT_CODES.keys())
    return jsonify(categories), 200

@app.route('/api/subcategories', methods=['GET'])
def get_subcategories():
    category = request.args.get('category')
    if not category or category not in CATEGORY_SUBJECT_CODES:
        return jsonify({"error": "Invalid category"}), 400
    subcategories = list(CATEGORY_SUBJECT_CODES[category].keys())
    return jsonify(subcategories), 200

@app.route('/api/laws', methods=['GET'])
def get_laws():
    category = request.args.get('category')
    sub_category = request.args.get('sub_category')

    if not category or category not in CATEGORY_SUBJECT_CODES:
        return jsonify({"error": "Invalid main category"}), 400
    if not sub_category or sub_category not in CATEGORY_SUBJECT_CODES[category]:
        return jsonify({"error": "Invalid subcategory"}), 400

    subject_codes = CATEGORY_SUBJECT_CODES[category][sub_category]

    # Query Firestore for documents with matching subject codes
    laws_ref = db.collection('legislative_proposals')
    docs = laws_ref.stream()

    matched_laws = []
    for doc in docs:
        data = doc.to_dict()
        procedure = data.get('procedure', {})
        subjects = procedure.get('subject', {})

        # Check if any of the subject codes match
        if any(code in subjects.keys() for code in subject_codes):
            # Extract basic information
            title = procedure.get('title', 'No Title')
            stage_reached = procedure.get('stage_reached', 'Unknown')
            reference = procedure.get('reference', 'N/A')
            
            # Extract instrument information
            instrument_list = procedure.get('instrument', [])
            instrument = instrument_list[0] if instrument_list else 'Unknown'
            if isinstance(instrument_list, list) and len(instrument_list) > 1:
                instrument = instrument_list

            # Process committees
            committees = []
            for committee in data.get('committees', []):
                committee_info = {
                    'name': committee.get('name', ''),
                    'role': committee.get('role', ''),
                    'rapporteur': []
                }
                
                # Process rapporteurs
                for rapporteur in committee.get('rapporteur', []):
                    rapporteur_info = {
                        'name': rapporteur.get('name', ''),
                        'political_group': rapporteur.get('political_group', ''),
                        'date': rapporteur.get('date', '').isoformat() if isinstance(rapporteur.get('date'), datetime) else rapporteur.get('date', '')
                    }
                    committee_info['rapporteur'].append(rapporteur_info)
                
                committees.append(committee_info)

            # Process events
            events = []
            for event in data.get('events', []):
                event_info = {
                    'type': event.get('type', ''),
                    'date': event.get('date', '').isoformat() if isinstance(event.get('date'), datetime) else event.get('date', ''),
                    'description': event.get('description', ''),
                    'docs': []
                }
                
                # Process event documents
                for doc in event.get('docs', []):
                    doc_info = {
                        'type': doc.get('type', ''),
                        'title': doc.get('title', ''),
                        'date': doc.get('date', '').isoformat() if isinstance(doc.get('date'), datetime) else doc.get('date', ''),
                        'url': doc.get('url', '')
                    }
                    event_info['docs'].append(doc_info)
                
                events.append(event_info)

            # Process changes
            changes = {}
            for date, description in data.get('changes', {}).items():
                # Convert datetime objects to ISO format strings
                if isinstance(date, datetime):
                    date = date.isoformat()
                changes[date] = description

            # Get the last change date
            last_change_date = max(changes.keys()) if changes else 'Unknown'
            if last_change_date != 'Unknown':
                try:
                    dt = datetime.fromisoformat(last_change_date)
                    last_change_date = dt.strftime('%b %d, %Y, %H:%M')
                except ValueError:
                    last_change_date = 'Unknown'

            # Construct the complete law object
            law_info = {
                "title": title,
                "stage_reached": stage_reached,
                "instrument": instrument,
                "reference": reference,
                "last_change_date": last_change_date,
                "procedure": {
                    "title": title,
                    "reference": reference,
                    "type": procedure.get('type', 'Unknown'),
                    "status": stage_reached
                },
                "committees": committees,
                "events": events,
                "changes": changes
            }

            matched_laws.append(law_info)

    return jsonify(matched_laws), 200



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)


    #L9Z7ds!P(N/e=8A