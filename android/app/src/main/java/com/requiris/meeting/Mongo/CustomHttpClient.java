package com.requiris.meeting.Mongo;

import org.apache.http.HttpResponse;
//import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
//import org.apache.http.impl.client.DefaultHttpClient;
import android.os.AsyncTask;

import java.net.HttpURLConnection;
import java.net.URL;

public class CustomHttpClient extends AsyncTask<String, Void, Boolean>  {

	@Override
	protected Boolean doInBackground(String... reminder) {
		try {
			URL requestUrl = new URL("MongoDB URL");
		}
		catch(Exception exception) {
		}
		return true;
	}

	public String getText() {
		try {
			URL uri = new URL("mongodb://meeting-admin:ce902ffsd318e@ds059306.mlab.com:59306/meeting");
			HttpURLConnection connection = (HttpURLConnection) uri.openConnection();

		} catch(Exception e) {
			return "Well that hecked up";
		}
		return "";
	}
}
