package com.requiris.meeting;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.app.Activity;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Intent;
import android.view.View;
import android.widget.TextView;
import android.widget.Button;

import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;
import com.mongodb.MongoClient;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;


public class MainActivity extends AppCompatActivity {

	private Button startButton;
	private Button timeButton;
	private TextView timerValue;

	private long startTime = 0L;
	private Handler customHandler = new Handler();
	long timeInMilliseconds = 0L;
	long timeSwapBuff = 0L;
	long updatedTime = 0L;

	private MongoClient mongoClient;
	private MongoDatabase db;
	private MongoCollection coll;
	private List<Long> timestampsList;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		timerValue = (TextView) findViewById(R.id.timerValue);
		startButton = (Button) findViewById(R.id.timerButton);
		timeButton = (Button) findViewById(R.id.printTimeButton);

		MongoClientURI uri  = new MongoClientURI("mongodb://meeting-admin:ce902ffsd318e@ds059306.mlab.com:59306/meeting");
		try {
			mongoClient = new MongoClient(uri);
			db = mongoClient.getDatabase(uri.getDatabase());
			coll = db.getCollection("private_timestamps");
		} catch (Exception e) {

		}

		timestampsList = new ArrayList<Long>();
	}

	/*@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.menu_main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();

		//noinspection SimplifiableIfStatement
		if (id == R.id.action_settings) {
			return true;
		}

		return super.onOptionsItemSelected(item);
	}*/

	public void startClock(View view) {
		startTime = SystemClock.uptimeMillis();
		customHandler.postDelayed(updateTimerThread, 0);

		new InsertTimeTask().execute();

		//TODO: task that creates or latches onto a new document
	}

	public void printTime(View view) {
		int secs = (int) (updatedTime / 1000);
		int mins = secs / 60;
		secs = secs % 60;
		int milliseconds = (int) (updatedTime % 1000);
		timerValue.setText("" + mins + ":"
				+ String.format("%02d", secs) + ":"
				+ String.format("%03d", milliseconds));

		timestampsList.add(updatedTime);
	}

	private Runnable updateTimerThread = new Runnable() {

		public void run() {

			timeInMilliseconds = SystemClock.uptimeMillis() - startTime;

			updatedTime = timeSwapBuff + timeInMilliseconds;

			customHandler.postDelayed(this, 0);
		}

	};

	//tasks

	//fix this to be smarter later, just want to see if it works for now
	class InsertTimeTask extends AsyncTask<Void, Void, Boolean> {
		protected Boolean doInBackground(Void... stuff) {
			try {
				Document doc = new Document();
				doc.put("timestamps", timestampsList);
				coll.insertOne(doc);
				return true;
			} catch (Exception e) {
				return false;
			}
		}

		protected void onPostExecute(Boolean b) {
			timestampsList = new ArrayList<Long>();
			if (b == true) {
				timerValue.setText("Done!");
			} else {
				timerValue.setText("Failed.");
			}
		}
	}

	//simple task to ensure I'm doing things right
	class GetCollNumTask extends AsyncTask<Void, Void, Long> {
		protected Long doInBackground(Void... stuff) {
			try {
				return coll.count();
			} catch (Exception e) {
				return (long)-1;
			}
		}

		protected void onPostExecute(Long collNum) {
			timerValue.setText("count!! " + collNum);
		}
	}
}

